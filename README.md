# Smart Crop Advisory System — README

## 🌾 About
AI-powered platform for small & marginal farmers in India. Provides multilingual, voice-enabled crop advisory, pest detection, and live market prices.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React Native (Expo) |
| **Backend** | FastAPI (Python) — Microservices |
| **ML (Crop)** | Scikit-learn (Random Forest) |
| **ML (Pest)** | PyTorch (MobileNet CNN) |
| **Database** | PostgreSQL + Redis |
| **DevOps** | Docker Compose |

---

## 📁 Project Structure

```
smart-crop-advisory/
├── backend/
│   ├── auth-service/       # JWT Auth (port 8001)
│   ├── advisory-service/   # Crop ML (port 8002)
│   ├── pest-service/       # Pest CNN (port 8003)
│   ├── data-service/       # Weather & Market (port 8004)
│   └── common/             # Shared utilities
├── frontend/               # React Native App
│   ├── src/
│   │   ├── screens/        # Home, CropAdvisor, PestAnalyzer, MarketPrices, Settings
│   │   ├── navigation/     # Bottom Tab Navigator
│   │   ├── store/          # Zustand state
│   │   ├── services/       # API clients
│   │   └── constants/      # Theme, translations
│   └── App.js
└── docker-compose.yml
```

---

## ⚙️ Getting Started

### 1. Copy environment file
```bash
cp .env.example .env
# Fill in your OPENWEATHER_API_KEY
```

### 2. Start Backend Services (Docker)
```bash
docker-compose up --build
```

Services available at:
- Auth: http://localhost:8001/docs
- Advisory: http://localhost:8002/docs  
- Pest: http://localhost:8003/docs
- Market/Weather: http://localhost:8004/docs

### 3. Start Frontend

#### 🌐 Website (Next.js)
```bash
cd web
npm run dev
# Open http://localhost:3000
```

#### 📱 Mobile App (React Native)
```bash
cd frontend
npm start
# Scan QR code with Expo Go app
```

---

## 🌍 Supported Languages
- English
- हिंदी (Hindi)
- मराठी (Marathi)
- తెలుగు (Telugu)
- தமிழ் (Tamil)

---

## 📊 Features
- 🌱 **Crop Recommendation** — NPK/pH/Soil based ML suggestions
- 🐛 **Pest Detection** — CNN model via camera/gallery image
- 🌦 **Weather Alerts** — OpenWeatherMap integration
- 💰 **Market Prices** — Live mandi prices (eNAM / APMC)
- 🎙 **Voice Support** — Whisper STT in local languages

---

## 🎯 Impact
- 20–30% potential yield increase via data-driven decisions
- 15–25% reduction in input costs
- Digital inclusion for 86% of India's small farmers (NABARD, 2022)
