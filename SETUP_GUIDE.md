# 🚀 Molecular GPT — Complete Setup Guide

Follow these steps **exactly** to get the project running.

---

## Step 1 — Prerequisites

Install these on your machine:
- [Node.js 20+](https://nodejs.org)
- [Python 3.11+](https://python.org)
- [Git](https://git-scm.com)
- [Docker Desktop](https://docker.com/products/docker-desktop) (for local DB)

---

## Step 2 — Get Free API Keys

### A) HuggingFace API Key (Required for AI)
1. Go to [huggingface.co](https://huggingface.co) → Sign up (free)
2. Profile → Settings → Access Tokens
3. New Token → Role: **Read** → Create
4. Copy: `hf_xxxxxxxxxxxxxxxxxxxx`

### B) Firebase (Required for Auth)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create New Project → Name: `molecular-gpt`
3. Authentication → Get Started → Enable **Email/Password** + **Google**
4. Project Settings → Your Apps → Add Web App
5. Copy the config values (apiKey, authDomain, etc.)

---

## Step 3 — Frontend Setup

```bash
cd molecular-gpt/frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local

# Edit .env.local — fill in your keys:
# NEXT_PUBLIC_HF_API_KEY=hf_your_key_here
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# (and other Firebase values)

# Start dev server
npm run dev
```

✅ Frontend runs at: **http://localhost:3000**

---

## Step 4 — Database Setup (Docker)

```bash
# From project root
docker-compose up db -d

# Verify it's running
docker ps
```

Or use **Supabase** (free cloud PostgreSQL):
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy the connection string
3. Run schema: paste `backend/schema.sql` in Supabase SQL Editor

---

## Step 5 — Backend Setup

```bash
cd molecular-gpt/backend

# Create virtual environment
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Edit .env — fill in:
# HUGGINGFACE_API_KEY=hf_your_key_here
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/molecular_gpt

# Start the server
uvicorn main:app --reload
```

✅ Backend runs at: **http://localhost:8000**
✅ API docs at: **http://localhost:8000/docs**

---

## Step 6 — Test It!

1. Open http://localhost:3000
2. Click **Create Free Account**
3. Sign up with email/password
4. Go to **Molecular Chat** → Ask: *"Explain the structure of Aspirin"*
5. Go to **Visualizer** → Type `CC(=O)Oc1ccccc1C(=O)O` → Click Visualize
6. Go to **Experiments** → Run Reaction Predictor

---

## Step 7 — Deploy (Production)

### Frontend → Vercel (Free)
```bash
cd frontend
npx vercel --prod
# Add environment variables in Vercel dashboard
```

### Backend → Railway (Free Tier)
```bash
# Install Railway CLI
npm install -g @railway/cli

cd backend
railway login
railway init
railway up
# Add env variables in Railway dashboard
```

### Database → Supabase (Free)
- Already set up in Step 4

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| HF model takes 20s | Normal on first request — model is loading |
| `Module not found` | Run `npm install` again |
| `Connection refused :8000` | Start backend with `uvicorn main:app --reload` |
| Firebase auth error | Check `.env.local` Firebase keys |
| 3D molecule not loading | Try a different SMILES or simpler molecule |
| `asyncpg` not found | Install with `pip install asyncpg` |

---

## Project Structure Quick Reference

```
molecular-gpt/
├── frontend/                    # Next.js 14 App
│   ├── app/
│   │   ├── (app)/               # Protected pages (require auth)
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── chat/            # AI Chemistry Chat
│   │   │   ├── visualizer/      # 3D Molecule Viewer
│   │   │   ├── builder/         # Molecule Builder
│   │   │   ├── experiments/     # AI Experiments
│   │   │   ├── research/        # Research Library
│   │   │   ├── lab/             # AI Lab Tools
│   │   │   ├── saved/           # Saved Molecules
│   │   │   ├── history/         # Activity History
│   │   │   ├── profile/         # User Profile
│   │   │   └── settings/        # App Settings
│   │   ├── login/               # Auth pages
│   │   ├── signup/
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable components
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand state
│   ├── lib/                     # API clients
│   └── types/                   # TypeScript types
│
├── backend/                     # FastAPI Python
│   ├── main.py                  # App entry point
│   ├── database.py              # DB connection
│   ├── schema.sql               # PostgreSQL schema
│   ├── models/models.py         # SQLAlchemy models
│   └── routes/                  # API endpoints
│       ├── molecules.py
│       ├── chat.py
│       ├── experiments.py
│       └── research.py
│
├── docker-compose.yml           # Local dev stack
└── README.md
```

---

## 🆓 Free APIs Summary

| Service | What it does | Free Limit |
|---------|-------------|------------|
| HuggingFace Inference | AI chemistry chat & analysis | 30k tokens/month |
| PubChem REST API | Molecule data, SMILES, properties | Unlimited |
| ChEMBL API | Drug molecules & bioactivity | Unlimited |
| Firebase Auth | User authentication | 10k users/month |
| Supabase PostgreSQL | Database | 500MB free |
| Vercel | Frontend hosting | Unlimited (hobby) |
| Railway | Backend hosting | 500hrs/month |

---

Built for hackathons, portfolios, and research. 🧬🚀
