import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// ────────────────────────────────────────────────
//  Auth Middleware — verify Supabase JWT
// ────────────────────────────────────────────────
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;
  // Create a per-request Supabase client scoped to this user's JWT
  req.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  next();
};

// ────────────────────────────────────────────────
//  DASHBOARD
// ────────────────────────────────────────────────
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const db = req.supabase;
    const [calRes, postRes, approvedRes, profileRes] = await Promise.all([
      db.from('calendars').select('id', { count: 'exact', head: true }),
      db.from('calendar_posts').select('id', { count: 'exact', head: true }),
      db.from('calendar_posts').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      db.from('profiles').select('credits, plan_type').eq('id', req.user.id).single()
    ]);

    const recentCals = await db.from('calendars')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      totalCalendars: calRes.count || 0,
      totalPosts: postRes.count || 0,
      approvedPosts: approvedRes.count || 0,
      credits: profileRes.data?.credits || 0,
      planType: profileRes.data?.plan_type || 'free',
      recentCalendars: recentCals.data || []
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// ────────────────────────────────────────────────
//  BRANDS CRUD
// ────────────────────────────────────────────────
app.get('/api/brands', auth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('brand_profiles').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/brands', auth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('brand_profiles').insert({ ...req.body, user_id: req.user.id }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/brands/:id', auth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('brand_profiles').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/brands/:id', auth, async (req, res) => {
  const { error } = await req.supabase
    .from('brand_profiles').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ────────────────────────────────────────────────
//  CALENDARS
// ────────────────────────────────────────────────
app.get('/api/calendars', auth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('calendars').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/calendars/:id', auth, async (req, res) => {
  const [calRes, postsRes] = await Promise.all([
    req.supabase.from('calendars').select('*').eq('id', req.params.id).single(),
    req.supabase.from('calendar_posts').select('*').eq('calendar_id', req.params.id).order('post_date', { ascending: true })
  ]);
  if (calRes.error) return res.status(404).json({ error: 'Calendar not found' });
  res.json({ ...calRes.data, posts: postsRes.data || [] });
});

// ────────────────────────────────────────────────
//  GENERATE — AI calendar + save to DB
// ────────────────────────────────────────────────
app.post('/api/generate', auth, async (req, res) => {
  try {
    const {
      businessName, niche, targetAudience, brandVoice,
      platform, frequency, startDate, numberOfDays, persona, campaignFocus, brandId,
      preferredPostTypes, includeHashtags, includeCTA, includeImageIdeas, language, festivalThemes
    } = req.body;

    // Platform character caps
    const charCaps = { Instagram: 2200, LinkedIn: 3000, Facebook: 63206, 'Twitter / X': 280 };
    const cap = charCaps[platform] || 2200;

    // Platform-specific post type guidance
    const platformTypes = {
      'Instagram': 'Static Image, Carousel (multi-slide), Reel (short video), Story',
      'LinkedIn': 'Text post, Image post, Article snippet, Poll, Document carousel',
      'Twitter / X': 'Tweet, Thread (multi-tweet), Quote tweet, Poll',
      'Facebook': 'Image post, Text post, Video idea, Event post, Link share'
    };

    const prompt = `You are an elite Indian social media copywriter specializing in ${platform} for ${persona === 'Creator / Personal Brand' ? 'content creators and personal brands' : 'Indian small businesses and startups'}.

Create a detailed ${numberOfDays}-day content calendar starting on ${startDate}.

═══ BRAND PROFILE ═══
Name: ${businessName}
Niche: ${niche}
Target Audience: ${targetAudience}
Brand Voice: ${brandVoice}
Profile Type: ${persona}
${campaignFocus ? `Campaign Focus: ${campaignFocus}` : ''}

═══ PLATFORM RULES ═══
Platform: ${platform}
Max caption length: ${cap} characters
Post types available: ${platformTypes[platform] || platformTypes['Instagram']}
${preferredPostTypes && preferredPostTypes !== 'Mix of all' ? `Preferred post type: ${preferredPostTypes}` : 'Use a healthy mix of all post types'}
Posting frequency: ${frequency}
Language: ${language || 'English + Hinglish mix'}

═══ CONTENT REQUIREMENTS ═══
${includeHashtags !== false ? '- Include 5-8 relevant, trending hashtags per post (mix of popular + niche tags)' : '- Do NOT include hashtags'}
${includeCTA !== false ? '- Include a strong call-to-action in every caption (e.g., "DM us", "Link in bio", "Comment below")' : ''}
${includeImageIdeas !== false ? '- Include a detailed image/visual description for each post (for AI image generation)' : ''}
${festivalThemes !== false ? '- Incorporate Indian festivals, seasonal events, and trending topics (e.g., Diwali, Independence Day, monsoon, IPL, trending memes)' : ''}
- Write captions that feel authentic and human, NOT generic AI-generated
- Each caption should tell a micro-story or hook the reader in the first line
- Vary post themes: educational, entertaining, promotional, behind-the-scenes, user-generated, testimonials

═══ OUTPUT FORMAT ═══
RETURN ONLY VALID JSON. No markdown, no backticks, no explanations. Just the raw JSON:
{
  "calendar": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "type": "Reel / Carousel / Static Image / Story / etc.",
      "caption": "Full caption text with emojis and line breaks",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "image_prompt": "Detailed visual description: scene, colors, objects, mood, style. For AI image generation.",
      "cta": "Call to action text",
      "suggested_link": ""
    }
  ]
}`;

    console.log(`[GENERATE] Generating ${numberOfDays}-day ${platform} calendar for "${businessName}"...`);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Robust JSON extraction
    let cleanJson = responseText;
    // Remove markdown code fences
    cleanJson = cleanJson.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
    // Try to extract JSON object
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in AI response');
    cleanJson = jsonMatch[0].trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      // Attempt to fix common JSON issues
      cleanJson = cleanJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      parsedData = JSON.parse(cleanJson);
    }

    if (!parsedData.calendar || !Array.isArray(parsedData.calendar)) {
      throw new Error('AI response missing calendar array');
    }

    console.log(`[GENERATE] Got ${parsedData.calendar.length} posts. Saving to DB...`);

    // Save calendar to DB
    const { data: calendar, error: calError } = await req.supabase
      .from('calendars')
      .insert({
        user_id: req.user.id,
        brand_id: brandId || null,
        title: `${businessName} — ${numberOfDays}-day ${platform} plan`,
        platform,
        frequency,
        start_date: startDate,
        number_of_days: parseInt(numberOfDays),
        status: 'ready'
      })
      .select()
      .single();

    if (calError) {
      console.error('[GENERATE] Calendar insert error:', calError);
      throw new Error(`Database error: ${calError.message}`);
    }

    // Save posts to DB
    const postsToInsert = parsedData.calendar.map((post, i) => ({
      calendar_id: calendar.id,
      post_date: post.date,
      post_type: post.type || 'Static',
      caption: post.caption || '',
      hashtags: post.hashtags || [],
      image_idea: post.image_prompt || '',
      link: post.suggested_link || '',
      status: 'draft'
    }));

    const { error: postsError } = await req.supabase.from('calendar_posts').insert(postsToInsert);
    if (postsError) {
      console.error('[GENERATE] Posts insert error:', postsError);
      // Calendar was created, return it even if posts partially failed
    }

    console.log(`[GENERATE] ✅ Calendar ${calendar.id} saved with ${postsToInsert.length} posts`);
    res.json({ calendarId: calendar.id, calendar: parsedData.calendar });

  } catch (error) {
    console.error("Generation Error:", error);
    res.status(500).json({ error: 'Failed to generate calendar' });
  }
});

// ────────────────────────────────────────────────
//  POSTS — Edit, Approve, Regenerate
// ────────────────────────────────────────────────
app.put('/api/posts/:id', auth, async (req, res) => {
  const { caption, hashtags } = req.body;
  const { data, error } = await req.supabase
    .from('calendar_posts').update({ caption, hashtags }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/posts/:id/approve', auth, async (req, res) => {
  const { approved } = req.body;
  const newStatus = approved ? 'approved' : 'draft';
  const { data, error } = await req.supabase
    .from('calendar_posts').update({ status: newStatus }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/posts/:id/regenerate', auth, async (req, res) => {
  try {
    // Fetch the current post
    const { data: post, error: fetchErr } = await req.supabase
      .from('calendar_posts').select('*, calendars(*)').eq('id', req.params.id).single();
    if (fetchErr || !post) return res.status(404).json({ error: 'Post not found' });

    const cal = post.calendars;
    const prompt = `Regenerate ONLY ONE social media post for ${cal.platform}.
Date: ${post.post_date}
Post type: ${post.post_type}
Previous caption was: "${post.caption}"

Write a completely NEW, fresh caption with different angle. Return ONLY valid JSON:
{
  "caption": "the new caption",
  "hashtags": ["#tag1", "#tag2"],
  "image_prompt": "describe the visual"
}
No markdown, no backticks, just JSON.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const clean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);

    const { data, error } = await req.supabase
      .from('calendar_posts')
      .update({ caption: parsed.caption, hashtags: parsed.hashtags, image_idea: parsed.image_prompt, status: 'draft' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to regenerate post' });
  }
});

// ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Postly API running on port ${PORT}`));
