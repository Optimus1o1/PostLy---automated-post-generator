## Social Media Content Agent (Web App)

Generate a **30-day social media content calendar** (captions + hashtags + CTA + best time) using **Anthropic Claude**, with optional **email delivery**.

### What you get

- **Landing page**: `http://localhost:3000/`
- **Generator form**: `http://localhost:3000/generate`
- **API routes**:
  - `POST /api/generate` → calls Claude and returns `{ content }`
  - `POST /api/deliver` → emails the generated content (optional SMTP)

### Setup (Windows)

1) Install dependencies

```bash
npm install
```

2) Create an env file

- Copy `.env.example` → `.env.local`
- Fill in at least:
  - `ANTHROPIC_API_KEY`

3) Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000/generate`.

### Optional: email delivery (SMTP)

If you want the “Email to Client” button to work, set these in `.env.local`:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- `SMTP_USER`, `SMTP_PASS`
- `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`

For Gmail, you typically need an **App Password** (not your normal password).
