import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())

app = FastAPI(title="Smart Crop AI Chatbot Service")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
model = None

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Gemini AI initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize Gemini: {e}")
else:
    print("⚠️ GEMINI_API_KEY not found. Running in DEMO mode.")

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.get("/health")
async def health_check():
    return {
        "status": "Healthy",
        "service": "chatbot-service",
        "mode": "Production" if model else "Demo"
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if not model:
        # Demo mode response
        return {
            "response": f"Hi! This is the Farmer Assistant (DEMO MODE). You asked: '{request.message}'. To get real AI answers, please add a GEMINI_API_KEY to your .env file.",
            "mode": "demo"
        }

    try:
        # Construct context for the farmer
        system_instruction = (
            "You are a helpful and knowledgeable agricultural expert assistant for the 'Smart Crop Advisory System'. "
            "Your goal is to help farmers with questions about crops, pests, soil, organic farming, and market prices. "
            "Keep your answers concise, practical, and supportive. Use simple language that a farmer can understand."
        )
        
        # Simple completion for now (can be expanded to full chat sessions later)
        prompt = f"{system_instruction}\n\nUser Question: {request.message}"
        response = model.generate_content(prompt)
        
        return {
            "response": response.text,
            "mode": "production"
        }
    except Exception as e:
        print(f"Chat error: {e}")
        return {
            "response": "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later.",
            "mode": "error"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
