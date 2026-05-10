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

## 🔮 Future Scope & Modifications

- **Multi-lingual Voice Navigation**: Integrating Speech-to-Text (e.g., Whisper AI) so farmers can use voice commands in regional languages (Hindi/Marathi/Tamil).
- **Market Price Integration**: Live APIs connecting to government 'Mandis' (e.g., e-NAM) to show live crop profit margins.
- **Progressive Web App (PWA)**: Allowing the web app to function perfectly offline on low-end Android mobile phones.

## 📡 IoT Integration (Hardware Add-ons)
You can completely automate this system to create a true **Smart Farm** by integrating simple IoT hardware nodes:

1. **Hardware Nodes**: Deploy an **ESP32** or **Arduino** equipped with:
   - **NPK & pH Sensors**: Buried in the soil to instantly read nutrient levels instead of manual typing.
   - **Capacitive Soil Moisture Sensors**: To gauge live hydration levels.
   - **DHT11/DHT22**: For live field temperature and humidity.
2. **Automated Pipeline**: The ESP32 sends a JSON payload via an HTTP `POST` request to your FastAPI `data-service` every hour natively.
3. **Automated Alerts**: The Backend can then trigger WhatsApp or SMS alerts (using Twilio/Gupshup) when soil moisture drops below critical levels, enabling automated smart irrigation!

---

## 🎯 Our Mission
To bridge the digital divide for **India's small farmers**, providing them with elite-level agricultural intelligence to increase yields by **20–30%** and reduce input costs.

---
*Created with ❤️ for the Indian Farming Community.*
