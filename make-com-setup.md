# Make.com Workflow Setup Guide

## Complete Step-by-Step Configuration

This guide shows how to build the automation in Make.com. Each section corresponds to adding a module.

---

## Part 1: Initial Setup

### Prerequisites
- [ ] Make.com account (free at make.com)
- [ ] Google Account connected to Make.com
- [ ] Google Sheet created named "Content Agent Intake"
- [ ] Anthropic API key (from console.anthropic.com)

---

## Part 2: The Scenario Structure

Your Make.com scenario will look like this:

```
[Google Sheets - Watch Rows]
         ↓
    [Filter Module]
         ↓
[Set Variable - Build Prompt]
         ↓
 [HTTP - Call Claude API]
         ↓
[JSON Parser - Extract Response]
         ↓
[Google Docs - Create Document]
         ↓
   [Gmail - Send Email]
         ↓
[Google Sheets - Update Row]
```

---

## Part 3: Module-by-Module Setup

### Module 1: Google Sheets - Watch Rows

**Purpose:** Trigger the workflow when a new row is added

**Steps:**
1. Click "+" in Make.com
2. Search "Google Sheets" → Select "Watch Rows"
3. Click "Add" → Connect your Google Account
4. Select Sheet: "Content Agent Intake"
5. Set "Limit" → 1 (only process one row at a time)
6. Set "Scheduling" → Every 15 minutes

**Configuration:**
```
Sheet: Content Agent Intake
Watch rows in: Any table
Maximum number of returned items: 1
Schedule: Every 15 minutes
```

---

### Module 2: Filter - Skip Processed Rows

**Purpose:** Only process NEW rows (skip ones already marked DONE)

**Steps:**
1. Click the wrench icon (→ Add a Filter)
2. Set condition:

```
Column J (Status) → Does not equal → DONE
```

**Why:** This prevents re-processing. After a row is processed, Column J gets "DONE".

---

### Module 3: Set Variable - Build the Prompt

**Purpose:** Construct the Claude prompt from the sheet data

**Steps:**
1. Click "+"
2. Search "Tools" → Select "Set Variable"
3. Variable name: `Claude_Prompt`
4. Paste the prompt template (see separate file: `claude-prompt-template.txt`)

**Key:** The template uses `{{2.ColumnName}}` syntax. Make.com auto-replaces these with Google Sheet values.

Example: `{{2.BusinessName}}` → "Chai Wala Café"

---

### Module 4: HTTP - Call Claude API

**Purpose:** Send the prompt to Claude and get content

**Configuration:**

```
URL: https://api.anthropic.com/v1/messages

Method: POST

Headers:
  x-api-key: YOUR_ANTHROPIC_API_KEY_HERE
  anthropic-version: 2023-06-01
  content-type: application/json

Body type: Raw

Content type: application/json

Body:
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "messages": [
    {
      "role": "user",
      "content": "{{Claude_Prompt}}"
    }
  ]
}
```

**Important:**
- Replace `YOUR_ANTHROPIC_API_KEY_HERE` with your actual key
- Never share this key publicly
- The model name `claude-3-5-sonnet-20241022` is the latest Claude Sonnet

---

### Module 5: JSON Parser

**Purpose:** Extract the text response from Claude's JSON response

**Steps:**
1. Click "+"
2. Search "JSON" → Select "Parse JSON"
3. Map the data:

```
Input: (select output from HTTP module)
```

**Mapping:**
Claude returns:
```json
{
  "content": [
    {
      "type": "text",
      "text": "30-DAY CONTENT PLAN FOR..."
    }
  ]
}
```

Extract the text: `content.0.text`

---

### Module 6: Google Docs - Create Document

**Purpose:** Write the content to a new Google Doc and share with client

**Configuration:**

```
Collection: (leave blank)

Document Name: {{2.BusinessName}} — 30-Day Content Plan — {{now}}

Document Content: {{5.content.0.text}}
  (This is the parsed Claude output)

Folders: (optional - organize in a folder)

Share Settings:
  Sharing: Anyone with the link can view
```

**Output:** Capture the Document URL for the next step:
- Click "Show advanced options"
- Save `webViewLink` for use in the email

---

### Module 7: Gmail - Send Email

**Purpose:** Deliver the Google Doc to the client

**Configuration:**

```
To: {{2.ClientEmail}}

Subject: Your 30-Day Content Plan is Ready! 🎉

Body:
---
Hi {{2.ClientName}},

Your personalized 30-day social media content calendar for 
{{2.BusinessName}} is ready!

📄 View Your Plan: {{6.webViewLink}}

What's Inside:
✅ 30 unique posts (one per day)
✅ Full captions with hashtags
✅ Call-to-action for each post
✅ Optimal posting times
✅ Platform-specific variations

You can copy-paste directly into Instagram, LinkedIn, TikTok, or 
any scheduler tool like Buffer, Later, or Meta Business Suite.

💡 Tips:
- Space out posts throughout the month
- Adapt captions to your current events
- Test different posting times
- Track engagement for best results

If you'd like next month's content or want revisions, 
just reply to this email!

Best regards,
[Your Name]
Social Media Content Agent
---
```

---

### Module 8: Google Sheets - Update Row

**Purpose:** Mark the row as processed to prevent duplicates

**Configuration:**

```
Sheet: Content Agent Intake

Select a table: (choose your sheet)

Choose a record to update: Row ID (from Module 1)

Keys:
  Column J (Status) → DONE

Additional Fields:
  Column K (Generated Doc URL) → {{6.webViewLink}} (optional)
  Column L (Processed At) → {{now}} (optional)
```

---

## Part 4: Testing Your Workflow

### Step 1: Test with Manual Data
1. Add a test row to your Google Sheet manually
2. In Make.com, go to your scenario
3. Click "Run once" (manual trigger)
4. Watch the modules execute in real-time
5. Check the Google Docs created
6. Check your email

### Step 2: Verify Each Step
- [ ] Google Sheet row detected?
- [ ] Filter passed (row not marked DONE)?
- [ ] HTTP call succeeded (check execution logs)?
- [ ] Google Doc created with content?
- [ ] Email received with correct link?
- [ ] Row marked DONE?

### Step 3: Debug Common Issues

**Error 401 (API Key):**
- Double-check your Anthropic API key in the HTTP headers
- Ensure no extra spaces before/after the key

**Error 400 (Bad Request):**
- Check the JSON body syntax
- Verify column references match your sheet

**No Google Doc created:**
- Ensure Google Account is properly connected
- Check Google Drive permissions

**Email not sent:**
- Verify `{{2.ClientEmail}}` is pulling the correct email
- Check Gmail account is connected

---

## Part 5: Enable Scheduling

Once testing is complete:

1. In your Make.com scenario, click the clock icon
2. Toggle "ON" (enable scheduling)
3. Set frequency: Every 15 minutes
4. Your workflow is now LIVE!

---

## Part 6: Monitor & Optimize

### Weekly Checks
- Review Google Sheets for new rows
- Check Gmail logs for failed emails
- Monitor Claude API costs in Anthropic console

### Quality Improvements
- Adjust the prompt for better output
- Add more specific examples in the prompt
- Test different Claude models

### Performance
- Optimize API costs by adjusting `max_tokens`
- Set up error notifications in Make.com

---

## Troubleshooting Reference

| Issue | Solution |
|-------|----------|
| Module won't connect to Google | Reconnect Google account in Make.com |
| Claude API errors | Check API key, verify model name, check token limit |
| Google Sheets not watching | Ensure "Watch rows" is the trigger, not "Get rows" |
| Duplicate content generated | Verify filter is working (Status != DONE) |
| Email bouncing | Check ClientEmail column is populated correctly |

---

## Cost Breakdown

- **Make.com Free Tier:** 1000 operations/month (handles ~100 clients)
- **Claude API:** ~₹0.50 per request (depends on output length)
- **Google Workspace:** Free
- **Gmail:** Free

---

## Next Steps

1. ✅ Set up all 8 modules (this guide)
2. ✅ Create Google Sheet & Form (see google-sheet-template.md)
3. ✅ Customize Claude prompt (see claude-prompt-template.txt)
4. ✅ Test with sample data
5. ✅ Enable scheduling
6. ✅ Share landing page with clients
7. ✅ Process first real request
