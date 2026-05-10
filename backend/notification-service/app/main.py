import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Crop Notification Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NotificationRequest(BaseModel):
    to: str
    message: str

@app.post("/send-sms")
async def send_sms(request: NotificationRequest):
    # In a real app:
    # client = Client(account_sid, auth_token)
    # client.messages.create(body=request.message, from_='+1234567890', to=request.to)
    logger.info(f"SMS SENT to {request.to}: {request.message}")
    return {"status": "success", "message": "SMS sent successfully (Mock)"}

@app.post("/send-whatsapp")
async def send_whatsapp(request: NotificationRequest):
    # In a real app:
    # client.messages.create(body=request.message, from_='whatsapp:+1234567890', to=f'whatsapp:{request.to}')
    logger.info(f"WHATSAPP SENT to {request.to}: {request.message}")
    return {"status": "success", "message": "WhatsApp sent successfully (Mock)"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "notification-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
