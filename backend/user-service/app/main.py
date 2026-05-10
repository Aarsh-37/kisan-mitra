import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Crop User Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock databases
users = {}
crop_history = []

class UserProfile(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[float] = None

class CropRecord(BaseModel):
    user_id: str
    crop_name: str
    planting_date: str
    expected_harvest: str
    area: float

@app.post("/register")
async def register_user(user: UserProfile):
    if user.id in users:
        raise HTTPException(status_code=400, detail="User already exists.")
    users[user.id] = user
    logger.info(f"USER REGISTERED: {user.email}")
    return {"status": "success", "user": user}

@app.get("/profile/{user_id}")
async def get_profile(user_id: str):
    if user_id not in users:
        # Return a mock if not found for demo purposes
        return {"id": user_id, "name": "Demo Farmer", "email": "farmer@example.com"}
    return users[user_id]

@app.post("/history")
async def add_crop_record(record: CropRecord):
    crop_history.append(record.dict())
    logger.info(f"CROP RECORD ADDED for User {record.user_id}: {record.crop_name}")
    return {"status": "success"}

@app.get("/history/{user_id}")
async def get_crop_history(user_id: str):
    return [r for r in crop_history if r['user_id'] == user_id]

@app.post("/otp/send")
async def send_otp(phone: str):
    logger.info(f"OTP SENT to {phone}: 123456 (Mock)")
    return {"status": "success", "message": "OTP sent."}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "user-service", "registered_users": len(users)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009)
