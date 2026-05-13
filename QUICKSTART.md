# 🚀 Quick Start Guide - Social Media Agent

## ✅ Setup Complete!

All dependencies are installed and environment files are configured. You have **two applications** ready to run:

---

## 📦 Applications Overview

### 1. **Postly** (React/Vite + Express Backend)
   - **Frontend**: Modern React app with Supabase auth
   - **Backend**: Express server with Google Gemini AI
   - **Port**: Frontend (5173), Backend (5000)
   - **Location**: `postly/`

### 2. **Social Media App** (Next.js)
   - **Full-stack**: Next.js with API routes
   - **AI**: Anthropic Claude integration
   - **Port**: 3000
   - **Location**: `social-media-app/`

---

## 🏃 How to Run

### Option 1: Run Postly (React + Express)

**Terminal 1 - Start Backend Server:**
```bash
cd social-media-agent/postly/server
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd social-media-agent/postly
npm run dev
```

Then open: http://localhost:5173

---

### Option 2: Run Next.js App

**Terminal:**
```bash
cd social-media-agent/social-media-app
npm run dev
```

Then open: http://localhost:3000

---

## ⚙️ Configuration Required

### For Postly:
- ✅ Supabase configured (already set)
- ✅ Google Gemini API key configured
- Server: `postly/server/.env`
- Frontend: `postly/.env.local`

### For Next.js App:
- ⚠️ **Add your Anthropic API key** in `social-media-app/.env.local`
- Replace: `ANTHROPIC_API_KEY=your_anthropic_api_key_here`
- Get key from: https://console.anthropic.com

---

## 🔑 Getting API Keys

### Anthropic Claude API (for Next.js app):
1. Go to https://console.anthropic.com
2. Sign up/Login
3. Go to Settings → API Keys
4. Create new key
5. Add ₹200 credit minimum
6. Copy key to `.env.local`

### Google Gemini API (already configured for Postly):
- Already set in `postly/server/.env`
- Key: AIzaSyDGaN9CJw7PkJtQ7_bJVc8qFBwpBZFkeaA

---

## 📁 Project Structure

```
social-media-agent/
├── postly/                          # React/Vite App
│   ├── src/
│   │   ├── pages/                   # All pages (Landing, Dashboard, etc.)
│   │   ├── components/ui/           # UI components
│   │   └── lib/                     # API, Supabase, Gemini
│   ├── server/                      # Express backend
│   │   ├── server.js               # Main server file
│   │   └── .env                    # Server config
│   └── .env.local                  # Frontend config
│
├── social-media-app/                # Next.js App
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── generate/           # Content generation
│   │   │   └── deliver/            # Email delivery
│   │   ├── generate/               # Generate page
│   │   └── login/                  # Auth page
│   └── .env.local                  # Config (needs Anthropic key)
│
└── Documentation files (README, guides, etc.)
```

---

## 🎯 Which App Should You Use?

### Use **Postly** if you want:
- ✅ Modern React UI with Supabase authentication
- ✅ Google Gemini AI for content generation
- ✅ Separate frontend/backend architecture
- ✅ Dashboard with brands, calendars management

### Use **Next.js App** if you want:
- ✅ Simpler full-stack setup
- ✅ Claude AI (Anthropic) for content generation
- ✅ Built-in API routes
- ✅ Email delivery with nodemailer

---

## 🐛 Troubleshooting

### Port Already in Use:
```bash
# Kill process on port 5173 (Vite)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 3000 (Next.js)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found:
```bash
# Reinstall dependencies
npm install
```

### API Key Issues:
- Check for spaces in API keys
- Ensure .env files are in correct locations
- Restart dev server after changing .env

---

## 📝 Next Steps

1. **Choose your app** (Postly or Next.js)
2. **Add Anthropic API key** (if using Next.js)
3. **Run the app** using commands above
4. **Test content generation**
5. **Follow setup-checklist.md** for full automation setup

---

## 💡 Features

### Postly Features:
- User authentication (Supabase)
- Brand management
- Content calendar creation
- AI content generation (Gemini)
- Dashboard analytics

### Next.js App Features:
- Content generation form
- Claude AI integration
- Email delivery
- Google Docs creation
- Simple authentication

---

## 📞 Support

- **Make.com Setup**: See `make-com-setup.md`
- **Full Setup Guide**: See `setup-checklist.md`
- **Troubleshooting**: See `troubleshooting-faq.md`
- **Sales Strategy**: See `sales-strategy.md`

---

## ✨ You're Ready!

Everything is installed and configured. Just:
1. Choose your app
2. Add API keys if needed
3. Run the commands above
4. Start building! 🚀

**Happy coding!** 💪
