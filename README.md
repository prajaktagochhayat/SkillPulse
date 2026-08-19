# ⚡ SkillPulse - Engineering & Technology Assessment Platform

**SkillPulse** is a production-grade engineering assessment platform built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Key Features

- **☀️ Light & Dark Theme System**: High-contrast typography and accessible color palettes.
- **📚 18 Engineering Subject Tracks**: Full curriculum across Python, C, C++, Java, JS, TS, SQL, MongoDB, DSA, ML, AI, Security, DevOps, OS, HTML/CSS, React, Node, and Git.
- **📖 144 Subject Chapters**: 8 detailed chapters per subject with multi-paragraph study notes, key takeaways, and executable code snippets.
- **🎮 Interactive Games Arcade**: Non-MCQ coding mini-games including Code Line Unscrambler Puzzles and Tech Term Word Finder Matrices.
- **⚙️ Profile Settings**: Avatar character gallery and custom image file upload.
- **🛡️ Universal Certificate Verifier**: Verification engine for official completion certificates.
- **🗄️ Supabase Database Integration**: Real-time authentication, user profiles, and attempt score analytics.

---

## 🚀 How to Deploy on Vercel (Step-by-Step)

### Step 1: Sign in to Vercel
1. Go to **[vercel.com](https://vercel.com/)**.
2. Sign in using your **GitHub** account (`prajaktagochhayat`).

### Step 2: Import Your Repository
1. Click **Add New...** -> **Project**.
2. Select **`prajaktagochhayat/SkillPulse`** from your repository list.

### Step 3: Configure Project Settings
- **Framework Preset**: Vite (Auto-detected).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Add Environment Variables
Expand **Environment Variables** and add:
- `VITE_SUPABASE_URL`: `https://tpqafxvxftfbxpbmfdtb.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcWFmeHZ4ZnRmYnhwYm1mZHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDQ1NjYsImV4cCI6MjEwMjcyMDU2Nn0.ikCjTairk4yJniXki3yalPdygyHy4JvXpCnx6eJNJ4U`

### Step 5: Click Deploy
Click **Deploy**. Vercel will compile and host your app live with an SSL certificate!
