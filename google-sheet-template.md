# Google Sheet Setup Guide

## Creating Your Intake Form (Google Sheet)

This is the form your clients fill out to trigger the automation.

---

## Step 1: Create the Sheet

1. Go to **Google Sheets** (sheets.google.com)
2. Click **"+ Create new"** → **"Blank spreadsheet"**
3. Name it: `Content Agent Intake`
4. Share link with clients or embed in your website

---

## Step 2: Column Headers (Row 1)

Add these exact column headers in Row 1 (A through J):

| Col | Header | Type | Description |
|-----|--------|------|-------------|
| A | Timestamp | Auto-generated | When the form was submitted (auto-filled) |
| B | Client Name | Text | Contact person's name |
| C | Business Name | Text | Name of the business |
| D | Niche / Industry | Text | What industry (e.g., "Coffee Shop", "Coaching", "E-commerce") |
| E | Target Audience | Text | Who they serve (e.g., "College students", "Entrepreneurs 25-40") |
| F | Brand Tone | Dropdown | Funny / Professional / Inspirational / Informative |
| G | Topics (Comma-Separated) | Text | 5 topics separated by commas |
| H | Platform | Dropdown | Instagram / LinkedIn / Twitter / TikTok / All |
| I | Client Email | Email | Where to send the final content |
| J | Status | Auto-filled | Leave blank (automation fills with "DONE") |

---

## Step 3: Format the Sheet

### Make it professional:
1. **Freeze Row 1:** Right-click Row 1 → Freeze one row
2. **Bold Headers:** Select Row 1 → Make Bold
3. **Add alternating colors:** Format → Alternating colors → Light theme
4. **Set column widths:**
   - Column A (Timestamp): 150px
   - Columns B-E: 200px each
   - Columns F-J: 150px each

### Data Validation (dropdowns):
1. Select Column F (Brand Tone)
2. Go to **Data** → **Data validation**
3. Choose "List of items"
4. Enter: `Funny, Professional, Inspirational, Informative`
5. Repeat for Column H (Platform):
   - `Instagram, LinkedIn, Twitter, TikTok, All`

---

## Step 4: Create a Google Form (Optional but Recommended)

Instead of clients filling the sheet directly, create a Google Form:

1. In your Sheet, go to **Tools** → **Create a new form**
2. This generates a form linked to your sheet
3. Modify the form questions:

```
Question 1: What's your name?
→ Link to: Column B (Client Name)

Question 2: Business name?
→ Link to: Column C (Business Name)

Question 3: What's your niche/industry?
→ Link to: Column D (Niche / Industry)

Question 4: Describe your target audience
→ Link to: Column E (Target Audience)

Question 5: Choose your brand tone
→ Link to: Column F (Brand Tone)
→ Type: Multiple choice (convert to checkboxes after)

Question 6: Enter 5 topics you want covered (comma-separated)
→ Link to: Column G (Topics)

Question 7: Which platform?
→ Link to: Column H (Platform)
→ Type: Dropdown

Question 8: Your email address
→ Link to: Column I (Client Email)
```

4. Click **Send** → Share the form link with clients

---

## Step 5: Sample Data Entry

Here's what a completed row looks like:

```
A: 5/6/2026 10:30 AM
B: Rahul Patel
C: Chai Wala Café
D: F&B / Café
E: College students, young professionals, tea enthusiasts
F: Funny
G: New chai blends, behind-the-scenes, customer stories, health benefits, seasonal drinks
H: Instagram
I: rahul@chaiwala.com
J: (empty - automation fills this)
```

---

## Step 6: Set Up Automatic Timestamps

Column A should auto-populate with submission timestamps:

1. Select cell A2
2. Enter formula: `=NOW()`
3. Drag down to fill more rows (or just let it auto-fill)

**Alternative:** If using Google Form, timestamps are automatic.

---

## Step 7: Share with Clients

### Option 1: Direct Sheet Access
- Click Share (top right)
- Set permissions: "Anyone with the link can edit"
- Share the link

### Option 2: Google Form (Better UX)
- Use the form link instead
- Clients fill form → auto-populates sheet
- More professional, cleaner interface

### Option 3: Embed on Your Website
```html
<iframe src="https://docs.google.com/forms/YOUR_FORM_ID/viewform?embedded=true" 
        width="640" height="500" frameborder="0" marginheight="0" marginwidth="0">
    Loading…
</iframe>
```

---

## Step 8: Columns to Add Later (Optional)

Once you have a few successful submissions, add these tracking columns:

| Column | Purpose |
|--------|---------|
| K | Document URL (Make.com fills this) |
| L | Processed At (Timestamp when completed) |
| M | Client Notes (Any feedback for next month) |
| N | Renewal Status (Paid / Pending / Cancelled) |
| O | Monthly Fee (Track ₹999) |

---

## Google Sheet Formula Examples

### Auto-generate document links:
```
=IF(J2="DONE", "View Document", "Pending")
```

### Track revenue:
```
=COUNTIF(N:N, "Paid") * 999
```

### Days since submission:
```
=DAYS(TODAY(), A2)
```

---

## Connection to Make.com

When you create the Make.com scenario:

1. Make.com will ask: "Which sheet do you want to watch?"
2. Select: "Content Agent Intake"
3. Make.com automatically reads columns A-J
4. Fills in variables like `{{2.BusinessName}}` from Column C

**Column numbering in Make.com:**
- Column A = 1
- Column B = 2 (Client Name)
- Column C = 3 (Business Name)
- Column D = 4 (Niche)
- Column E = 5 (Target Audience)
- Column F = 6 (Brand Tone)
- Column G = 7 (Topics)
- Column H = 8 (Platform)
- Column I = 9 (Email)
- Column J = 10 (Status)

So in prompts, use: `{{2.3}}` for Business Name (Module 2, Column 3)

---

## Security & Privacy

- Never share your Sheet publicly (lock to "View only")
- Only share the Google Form link with clients
- Make.com handles secure connections
- Never paste API keys in the sheet

---

## Test Data (for your first run)

Use this to test before going live:

```
Name: Test Client
Business: Test Café
Niche: Coffee / Café
Audience: Coffee enthusiasts, students
Tone: Funny
Topics: Coffee recipes, latte art, espresso tips, barista stories, seasonal drinks
Platform: Instagram
Email: your-email@gmail.com
```

---

## Checklist

- [ ] Sheet created and named "Content Agent Intake"
- [ ] Headers added in Row 1 (A through J)
- [ ] Data validation set up (dropdowns for F and H)
- [ ] Google Form created (if using form method)
- [ ] Timestamp formula added to Column A
- [ ] Share link created
- [ ] Sample data entered for testing
- [ ] Make.com connected to the sheet
- [ ] First real client submission received

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Make.com not detecting new rows | Ensure column headers match exactly, wait 15 min for scheduled check |
| Timestamp not auto-filling | Use `=NOW()` formula or enable auto-timestamp on Google Form |
| Dropdown not working in Make.com | Data validation must be set on the actual column |
| Email not sending | Verify client email is in Column I and formatted correctly |
| Duplicate rows processing | Make sure "Status" column marks "DONE" after processing |
