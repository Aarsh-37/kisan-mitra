# Kisan Mitra 🌾 - A Smart Crop Advisory System 

An AI-powered digital ecosystem designed to empower small and marginal farmers in India with data-driven insights, machine learning predictions, and an AI-powered assistant.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | **Next.js 15 (React)**, Tailwind CSS, Zustand, Lucide React |
| **Backend** | **FastAPI (Python)** — Microservices Architecture |
| **Authentication** | **Auth.js (NextAuth)** with Google & Credentials Support |
| **ML/AI Intelligence** | **Gemini AI** (Chat), Scikit-learn (Crop/Yield), PyTorch (Pest) |
| **Database** | **PostgreSQL** (Managed via Prisma ORM) |
| **State Management** | **Zustand** (Frontend UI State) |

---


## ⚙️ Development Setup

### 1. Root Configuration
Copy the environment template and fill in your API keys (OpenWeather, Google Client ID, Gemini).
```bash
cp .env.example .env
```

### 2. Database Setup
```bash
cd web
npm install
npx prisma db push
```

### 3. Start Backend Services
Launch each microservice in its own terminal:
```bash
# Advisory Service (Port 8002)
cd backend/advisory-service && uvicorn app.main:app --port 8002 --reload

# Chatbot Service (Port 8005)
cd backend/chatbot-service && uvicorn app.main:app --port 8005 --reload

# (Repeat for pest-service:8003 and data-service:8004)
```

### 4. Start Next.js Frontend
```bash
cd web
npm run dev
# Open http://localhost:3000
```

---

## 🌟 Key Features

- 🌱 **Smart Crop Advisor** — Instant soil-based ML recommendations (N-P-K-pH).
- 📈 **Yield Predictor** — Predict harvest output based on environmental factors.
- 🐛 **Pest Analyzer** — Upload leaf images for AI-powered disease diagnosis.
- 🌦 **Live Weather** — Hyper-local weather updates for the farmer's village.
- 👨‍🌾 **Farmer Profiles** — Personalized storage for farm size, location, and history.
- 🤖 **AI Assistant** — Floating chatbot powered by Gemini for any farming query.
- 🔐 **Secure Access** — Industry-standard Auth with Google Social Login.

---

## 🎯 Our Mission
To bridge the digital divide for **India's small farmers**, providing them with elite-level agricultural intelligence to increase yields by **20–30%** and reduce input costs.

---
*Created with ❤️ for the Indian Farming Community.*
