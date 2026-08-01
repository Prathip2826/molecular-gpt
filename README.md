<div align="center">

# 🧬 Molecular GPT

### The World's Most Advanced AI-Powered Chemistry Platform

*Visualize molecules in 3D · Chat with AI · Run experiments · Discover drugs*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-molecular--gpt.vercel.app-6366f1?style=for-the-badge)](https://molecular-gpt.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_API-HuggingFace_Space-ff6b35?style=for-the-badge)](https://prathip2826-molecular-gpt-api.hf.space)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![RDKit](https://img.shields.io/badge/RDKit-Chemistry_Engine-8b5cf6?style=flat-square)

<br/>

![Repo Size](https://img.shields.io/github/repo-size/Prathip2826/molecular-gpt?style=flat-square&color=orange)
![Last Commit](https://img.shields.io/github/last-commit/Prathip2826/molecular-gpt?style=flat-square&color=blue)
![Issues](https://img.shields.io/github/issues/Prathip2826/molecular-gpt?style=flat-square&color=red)
![Stars](https://img.shields.io/github/stars/Prathip2826/molecular-gpt?style=flat-square&color=yellow)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Performance & Optimization](#-performance--optimization)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Testing](#-testing)
- [Troubleshooting / FAQ](#-troubleshooting--faq)
- [Contributing](#-contributing)
- [License](#-license)
- [Developer](#-developer)

---

## ✨ Overview

**Molecular GPT** is a full-stack, AI-powered chemistry platform that combines large language models, cheminformatics tooling (RDKit), and real-time 3D visualization into a single seamless experience. It's built for researchers, students, and chemistry enthusiasts who want an intelligent co-pilot for exploring molecular structures, running virtual experiments, and accelerating drug-discovery workflows.

> 🔬 *"Making chemistry accessible to everyone through the power of AI."*

**Why Molecular GPT?**

| Traditional Chemistry Tools | Molecular GPT |
|---|---|
| Static structure viewers | Interactive AI-guided 3D exploration |
| Manual SMILES lookup | Natural-language molecule search |
| Siloed research notes | Integrated research library with cloud sync |
| No conversational context | AI chat with full molecular reasoning |

---

## 🌐 Live Demo

| Service | URL | Status |
|---|---|---|
| 🎨 Frontend | [molecular-gpt.vercel.app](https://molecular-gpt.vercel.app) | ![Online](https://img.shields.io/badge/Online-22c55e?style=flat-square) |
| ⚙️ Backend API | [prathip2826-molecular-gpt-api.hf.space](https://prathip2826-molecular-gpt-api.hf.space) | ![Online](https://img.shields.io/badge/Online-22c55e?style=flat-square) |
| 🗄️ Database | Supabase PostgreSQL | ![Connected](https://img.shields.io/badge/Connected-22c55e?style=flat-square) |
| 📄 API Docs | [/docs](https://prathip2826-molecular-gpt-api.hf.space/docs) (Swagger UI) | ![Available](https://img.shields.io/badge/Available-22c55e?style=flat-square) |

---

## 🚀 Key Features

<table>
<tr>
<td width="50%">

### 🤖 AI Molecular Chat
Chat with an AI chemistry expert powered by **Groq's LLaMA 3.1 (8B Instant)**. Ask about structures, reactions, drug mechanisms, and get instant, scientifically grounded answers with sub-second inference latency.

### 🔬 3D Molecule Visualizer
Interactive 3D visualization powered by **3Dmol.js** and **PubChem**. Ball & Stick, Space Fill, or Wireframe rendering modes. Supports any SMILES string or molecule name search with live rotation, zoom, and atom labeling.

### ⚗️ Experiment Lab
Design and simulate chemical experiments with AI assistance. Track results, log observations, and explore reaction pathways — all without a physical lab.

</td>
<td width="50%">

### 💊 Drug Discovery
Explore drug-like molecules, analyze molecular properties (LogP, molecular weight, H-bond donors/acceptors), predict bioactivity trends, and understand pharmacological mechanisms.

### 📚 Research Library
Save and organize molecular research with cloud persistence. Bookmark molecules, attach notes, and build a personal chemistry knowledge base synced across devices.

### 🧱 Molecule Builder
Build custom molecules from scratch using SMILES notation with real-time validation, RDKit-powered sanitization, and instant 3D preview.

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
                         ┌────────────────────────────┐
                         │        USER BROWSER         │
                         └──────────────┬───────────────┘
                                        │ HTTPS
                         ┌──────────────▼───────────────┐
                         │   FRONTEND — Next.js 16       │
                         │   (Vercel Edge Network)       │
                         │   • App Router + TypeScript   │
                         │   • Firebase Auth (client)    │
                         │   • 3Dmol.js Visualization     │
                         │   • Next.js API Route Proxies  │
                         └──────────────┬───────────────┘
                                        │ REST / JSON (proxied to avoid CORS)
                         ┌──────────────▼───────────────┐
                         │   BACKEND — FastAPI (Docker)  │
                         │   (HuggingFace Spaces)        │
                         │   • RDKit chemistry engine    │
                         │   • Groq LLaMA 3.1 inference   │
                         │   • PubChem REST integration   │
                         │   • SQLAlchemy async ORM       │
                         └──────────────┬───────────────┘
                                        │ asyncpg (SSL)
                         ┌──────────────▼───────────────┐
                         │   DATABASE — Supabase          │
                         │   (Managed PostgreSQL)         │
                         │   • Chat sessions & messages    │
                         │   • Saved molecules              │
                         │   • Experiments & results         │
                         └────────────────────────────────┘
```

**Request flow:** Browser → Next.js API route (proxy) → FastAPI backend → Groq / PubChem / RDKit → Supabase → response streamed back to the client. This proxy layer is what eliminates CORS issues between Vercel and Hugging Face Spaces.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16 (App Router)** | React framework, SSR/SSG, API routes |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth UI animations |
| **3Dmol.js** | GPU-accelerated 3D molecular rendering |
| **Zustand** | Lightweight global state management |
| **Firebase Auth** | Email/password + Google sign-in |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance async Python API |
| **RDKit** | Cheminformatics — SMILES parsing, validation, descriptors |
| **SQLAlchemy (async)** | ORM with async PostgreSQL support |
| **Groq API** | Ultra-low-latency LLaMA 3.1 inference |
| **PubChem REST API** | Access to 118M+ compound records |
| **asyncpg** | High-performance async PostgreSQL driver |
| **Uvicorn** | ASGI server (port 7860 on HF Spaces) |

### Infrastructure
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting, edge deployment, CI/CD |
| **Hugging Face Spaces** | Dockerized backend hosting (CPU basic) |
| **Supabase** | Managed PostgreSQL with auto-scaling |
| **Firebase** | Authentication & session management |
| **Docker** | Backend containerization |

---

## 📁 Project Structure

```
molecular-gpt/
├── frontend/                  # Next.js 16 application (deployed to Vercel)
│   ├── app/                   # App Router pages & layouts
│   │   ├── api/                # API route proxies (/chat, /experiment, /lab)
│   │   └── ...
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Firebase config, utilities
│   ├── public/                # Static assets (icon.png, etc.)
│   ├── tsconfig.json
│   ├── next.config.js
│   └── package.json
│
├── backend/                   # FastAPI application (deployed to HF Spaces)
│   ├── main.py                 # App entrypoint (Uvicorn, port 7860)
│   ├── routers/                # /chat, /molecules, /experiments endpoints
│   ├── models/                 # SQLAlchemy models
│   ├── services/               # Groq, PubChem, RDKit integration
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Firebase](https://firebase.google.com) project
- A [Groq API key](https://console.groq.com)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Prathip2826/molecular-gpt.git
cd molecular-gpt/frontend

# Install dependencies (legacy peer deps required for current package set)
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env.local
```

```bash
# Run the development server
npm run dev
```

Visit `http://localhost:3000` to view the app.

### Backend Setup

```bash
cd molecular-gpt/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

```bash
# Run the API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Run with Docker (Backend)

```bash
cd molecular-gpt
docker-compose up --build
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `GROQ_API_KEY` | Groq API key (used by server-side API routes) |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://user:password@host:5432/dbname` (Supabase connection string) |
| `GROQ_API_KEY` | Groq API key for LLaMA 3.1 inference |

> ⚠️ **Never commit `.env` or `.env.local` files.** Both are excluded via `.gitignore`. Rotate any key that was ever pushed to a public repo.

---

## 📡 API Reference

Base URL: `https://prathip2826-molecular-gpt-api.hf.space`

### Health
```http
GET /              → Health check
GET /health         → Detailed API status
```

### Chat
```http
POST /chat/simple                 → Stateless AI chat (no session)
POST /chat/session                → Create a new chat session
GET  /chat/sessions               → List sessions for current user
POST /chat/{session_id}/message   → Send a message within a session
```

**Example request:**
```json
POST /chat/simple
{
  "message": "Explain the mechanism of action of aspirin",
  "model": "llama-3.1-8b-instant"
}
```

**Example response:**
```json
{
  "response": "Aspirin irreversibly inhibits cyclooxygenase (COX)...",
  "tokens_used": 187,
  "latency_ms": 320
}
```

### Molecules
```http
GET    /molecules            → List saved molecules
POST   /molecules            → Save a new molecule
DELETE /molecules/{id}       → Delete a saved molecule
```

### Experiments
```http
POST /experiments            → Create a new experiment
GET  /experiments            → List experiments
```

Full interactive documentation (Swagger UI) is available at [`/docs`](https://prathip2826-molecular-gpt-api.hf.space/docs).

---

## 🗄️ Database Schema

```
users            → Firebase UID, email, created_at
chat_sessions    → id, user_id, title, created_at
chat_messages    → id, session_id, role, content, created_at
molecules        → id, user_id, smiles, name, properties (JSON), created_at
experiments      → id, user_id, name, parameters (JSON), results (JSON), created_at
```

All tables use SQLAlchemy async models with SSL-enforced connections (`connect_args={"ssl": "require"}`) to Supabase.

---

## ☁️ Deployment

### Frontend → Vercel
- Root Directory: **`frontend`** (must be set explicitly in Vercel dashboard → Settings → General)
- Install Command: `npm install --legacy-peer-deps`
- Deploy via CLI from the **parent** `molecular-gpt` directory:
  ```bash
  vercel --prod
  ```

### Backend → Hugging Face Spaces
- Dockerized FastAPI app running on **Uvicorn, port 7860**
- On dependency changes, trigger a **Factory Rebuild** (not a plain Restart) to clear the Docker layer cache
- Required system packages: `libxrender1`, `libxext6` (for RDKit), `libgl1` (not `libgl1-mesa-glx`, which is unavailable on newer Debian)

### Database → Supabase
- Free tier auto-pauses after inactivity; resuming takes up to ~5 minutes
- Restart the backend Space after the database becomes healthy to refresh connections

---

## ⚡ Performance & Optimization

- **Edge-deployed frontend** via Vercel's global CDN for low-latency page loads
- **Groq inference** delivers near-instant LLM responses compared to traditional GPU-hosted APIs
- **Next.js API route proxies** avoid client-side CORS overhead and hide backend URLs from the browser
- **Async SQLAlchemy + asyncpg** for non-blocking database I/O under concurrent load
- **TypeScript target `es2017`** for smaller, modern JS bundles vs. legacy ES5 output

---

## 🔒 Security

- Firebase Authentication handles all credential storage — no passwords touch the app's own database
- API keys are server-side only (Groq key never exposed to the client)
- SSL-enforced database connections
- `.env` / `.env.local` excluded from version control
- CORS restricted at the FastAPI layer to trusted origins

---

## 🗺️ Roadmap

- [ ] Public molecule sharing & community library
- [ ] Batch SMILES upload & bulk property analysis
- [ ] Reaction prediction module
- [ ] Export research library to PDF/CSV
- [ ] Mobile-optimized 3D viewer
- [ ] Multi-model AI selection (beyond LLaMA 3.1)

---

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint
npm run build      # verifies production build succeeds

# Backend
cd backend
pytest
```

---

## ❓ Troubleshooting / FAQ

<details>
<summary><strong>RDKit shows "fallback mode" warning on the backend</strong></summary>

Add `rdkit` to `requirements.txt`, add `libxrender1` and `libxext6` to the Dockerfile via `apt-get`, then trigger a **Factory Rebuild** on Hugging Face Spaces (a plain Restart reuses the cached image and won't pick up new dependencies).
</details>

<details>
<summary><strong>Vercel deploy fails with a "frontend/frontend" path error</strong></summary>

This happens when the Vercel Root Directory is set to `frontend` in the dashboard **and** you run `vercel --prod` from inside the `frontend` folder. Run the CLI from the parent `molecular-gpt` directory instead.
</details>

<details>
<summary><strong>Backend returns database connection errors after inactivity</strong></summary>

Supabase's free tier auto-pauses the database after a period of inactivity. Trigger a query to resume it (~5 minutes), then restart the Hugging Face Space to establish fresh connections.
</details>

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure `npm run lint` and `npm run build` pass before submitting a PR.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<div align="center">

**Built with ❤️ by Prathip**

[![GitHub](https://img.shields.io/badge/GitHub-Prathip2826-181717?style=for-the-badge&logo=github)](https://github.com/Prathip2826)

*"Chemistry meets Artificial Intelligence"* 🧬✨

<br/>

⭐ **Star this repo if you found it useful!** ⭐

[![Star History](https://img.shields.io/github/stars/Prathip2826/molecular-gpt?style=social)](https://github.com/Prathip2826/molecular-gpt)

</div>
