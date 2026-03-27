import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Crop AI Chatbot Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
model = None

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        logger.info("Gemini AI initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini: {e}")
else:
    logger.warning("GEMINI_API_KEY not found. Running in demo mode.")

class ChatRequest(BaseModel):
    message: str

@app.get("/health")
async def health_check():
    return {
        "status": "Healthy",
        "service": "chatbot-service",
        "mode": "Production" if model else "Demo"
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    if not model:
        return {
            "response": f"Demo Mode: You asked '{message}'. Please configure GEMINI_API_KEY for real responses.",
            "mode": "demo"
        }

    try:
        system_instruction = (
            "You are a professional agricultural expert assistant for the Smart Crop Advisory System. "
            "Help farmers with questions about crops, pests, soil, organic farming, and market prices. "
            "Provide concise, practical, and supportive answers in clear, accessible language."
        )
        
        prompt = f"{system_instruction}\n\nUser Question: {message}"
        response = model.generate_content(prompt)
        
        return {
            "response": response.text,
            "mode": "production"
        }
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI response. Please try again later.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
