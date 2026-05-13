import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { businessName, niche, targetAudience, brandTone, topics, platform } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key is not configured." },
        { status: 500 }
      );
    }

    const prompt = `You are an expert social media content strategist specializing in small business growth.

Create a complete 30-day content calendar for the following business.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry/Niche: ${niche}
- Target Audience: ${targetAudience}
- Brand Tone: ${brandTone}
- Key Topics: ${topics}
- Platform: ${platform}

INSTRUCTIONS:
Generate exactly 30 social media posts, one for each day. For each post provide:

1. DAY [number] - [Post Theme]
2. CAPTION: (The complete post text, 150-300 words, natural and engaging)
3. HASHTAGS: (15-20 relevant, specific hashtags - NOT generic ones)
4. CALL TO ACTION: (One clear, specific CTA for this post)
5. BEST TIME TO POST: (Optimal time for ${platform})
6. CONTENT TYPE: (Carousel/Reel/Quote/Story/Behind-the-scenes/Testimonial/How-to/etc)

REQUIREMENTS:
✓ Each post must feel fresh, varied, and unique from others
✓ Mix content types: tips, stories, questions, behind-the-scenes, product highlights, testimonials, educational, promotional, trending
✓ Use the brand tone (${brandTone}) consistently throughout
✓ Hashtags must be specific to ${niche} - no generic hashtags
✓ Write naturally - sounds human, not AI-generated
✓ Include 3-4 posts specifically about ${businessName}'s unique value proposition and why customers love it
✓ Include at least 2 trending/timely posts (ask questions, engage)
✓ Include 2-3 customer testimonial or case study style posts
✓ Consider seasonal/cultural moments if relevant to ${platform}
✓ Every CTA should drive engagement or lead to conversion
✓ Vary post length - some short, some longer

FORMATTING:
- Start with: "30-DAY CONTENT CALENDAR FOR ${businessName}"
- Use clear separators between days
- Make it copy-paste ready for schedulers like Buffer, Later, Meta Business Suite
- Include a summary at the end with content breakdown
- Add a note: "Last updated: [today's date]"

PLATFORM-SPECIFIC TIPS:
- Instagram: Use 20-25 hashtags, keep captions engaging, emoji placement matters
- LinkedIn: Be professional but personable, longer captions work, share insights
- Twitter/X: Keep captions short/punchy, maximize engagement, use trending topics
- TikTok: Hook in first 3 seconds, caption should be fun, hashtags less important

START NOW - Generate the 30-day calendar:`;

    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
    const result = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = result?.content
      ?.filter((c) => c.type === "text")
      ?.map((c) => c.text)
      ?.join("\n")
      ?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Claude returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content", details: error.message },
      { status: 500 }
    );
  }
}
