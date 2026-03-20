# 🧬 Molecular GPT

<div align="center">

![Molecular GPT Banner](https://img.shields.io/badge/Molecular_GPT-AI_Chemistry_Assistant-6366f1?style=for-the-badge&logo=molecule&logoColor=white)

**The World's Most Advanced AI Chemistry Assistant**

*Visualize molecules in 3D · Chat with AI · Run experiments · Discover drugs*

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

</div>

---

## ✨ What is Molecular GPT?

Molecular GPT is a **full-stack AI-powered chemistry platform** that brings the power of modern AI to molecular science. Whether you're a researcher, student, or chemistry enthusiast — Molecular GPT gives you an intelligent assistant that can explain complex molecules, visualize 3D structures, run simulations, and accelerate drug discovery workflows.

> 🔬 *"Making chemistry accessible to everyone through the power of AI"*

---

## 🌐 Live Demo

| Service | URL | Status |
|---------|-----|--------|
| 🎨 Frontend | [molecular-gpt.vercel.app](https://molecular-gpt.vercel.app) | ![Online](https://img.shields.io/badge/Online-22c55e?style=flat-square) |
| ⚙️ Backend API | [prathip2826-molecular-gpt-api.hf.space](https://prathip2826-molecular-gpt-api.hf.space) | ![Online](https://img.shields.io/badge/Online-22c55e?style=flat-square) |
| 🗄️ Database | Supabase PostgreSQL | ![Connected](https://img.shields.io/badge/Connected-22c55e?style=flat-square) |

---

## 🚀 Key Features

### 🤖 AI Molecular Chat
Chat with an AI chemistry expert powered by **Groq's LLaMA 3.1** — ask anything about molecular structures, reactions, drug mechanisms, and more. Get instant, scientifically accurate answers.

### 🔬 3D Molecule Visualizer
Interactive 3D molecular visualization powered by **3Dmol.js** and **PubChem**. View molecules in Ball & Stick, Space Fill, or Wireframe mode. Supports any SMILES string or molecule name search.

### ⚗️ Experiment Lab
Design and simulate chemical experiments with AI assistance. Run experiments, track results, and explore reaction pathways — all without a physical lab.

### 💊 Drug Discovery
Leverage AI to explore drug-like molecules, analyze molecular properties, predict bioactivity, and understand pharmacological mechanisms.

### 📚 Research Library
Save and organize your molecular research. Keep notes, bookmark molecules, and build your personal chemistry knowledge base.

### 🧱 Molecule Builder
Build custom molecules from scratch using SMILES notation with real-time validation and instant 3D preview.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MOLECULAR GPT                         │
├─────────────────┬───────────────────┬────────────────────┤
│   Frontend      │    Backend API    │    Database        │
│   Next.js 16    │    FastAPI        │    Supabase        │
│   Vercel        │    HuggingFace    │    PostgreSQL      │
│   Firebase Auth │    Groq AI        │    SQLAlchemy      │
└─────────────────┴───────────────────┴────────────────────┘
         │                  │                   │
         └──────────────────┴───────────────────┘
                    Full Stack Integration
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **3Dmol.js** | 3D molecular visualization |
| **Zustand** | State management |
| **Firebase Auth** | User authentication |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | High-performance Python API |
| **SQLAlchemy** | Async ORM |
| **Groq API** | Ultra-fast LLaMA 3.1 inference |
| **PubChem API** | Molecular data & structures |
| **asyncpg** | Async PostgreSQL driver |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting & deployment |
| **HuggingFace Spaces** | Backend API hosting |
| **Supabase** | PostgreSQL database |
| **Firebase** | Authentication & storage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account
- Firebase project
- Groq API key

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Prathip2826/molecular-gpt.git
cd molecular-gpt/frontend

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local
```

Add your environment variables to `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://prathip2826-molecular-gpt-api.hf.space
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GROQ_API_KEY=your_groq_api_key
```

```bash
# Run development server
npm run dev
```

### Backend Setup

```bash
cd molecular-gpt/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Add your environment variables to `.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
GROQ_API_KEY=your_groq_api_key
```

```bash
# Run the API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📡 API Endpoints

```
GET  /                          - Health check
GET  /health                    - API status

POST /chat/simple               - AI chat (no session)
POST /chat/session              - Create chat session
GET  /chat/sessions             - Get user sessions
POST /chat/{session_id}/message - Send message

GET  /molecules                 - Get saved molecules
POST /molecules                 - Save molecule
DELETE /molecules/{id}          - Delete molecule

POST /experiments               - Create experiment
GET  /experiments               - Get experiments
```

---

## 🧪 Supported Molecules

Molecular GPT supports **118M+ molecules** from PubChem including:

- 💊 Pharmaceuticals (Aspirin, Ibuprofen, Paracetamol)
- ☕ Natural compounds (Caffeine, Glucose, Ethanol)
- 🧪 Research compounds (custom SMILES)
- 🔬 Complex biomolecules (proteins, nucleotides)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<div align="center">

**Built with ❤️ by Prathip**

[![GitHub](https://img.shields.io/badge/GitHub-Prathip2826-181717?style=for-the-badge&logo=github)](https://github.com/Prathip2826)

*"Chemistry meets Artificial Intelligence"* 🧬✨

</div>

---

<div align="center">

⭐ **Star this repo if you found it useful!** ⭐

[![Star History](https://img.shields.io/github/stars/Prathip2826/molecular-gpt?style=social)](https://github.com/Prathip2826/molecular-gpt)

</div>
