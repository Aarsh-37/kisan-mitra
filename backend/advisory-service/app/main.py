from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import pickle
import numpy as np
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = FastAPI(title="Smart Crop Advisory Service")

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

model = None

@app.on_event("startup")
async def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        print("Model loaded successfully.")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}")

@app.post("/recommend")
async def recommend_crop(data: dict):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded or available.")
    
    try:
        # Extract features (N, P, K, temperature, humidity, ph, rainfall)
        # Default to 0 if a feature is missing
        n = float(data.get("N", 0))
        p = float(data.get("P", 0))
        k = float(data.get("K", 0))
        temp = float(data.get("temperature", 0))
        humidity = float(data.get("humidity", 0))
        ph = float(data.get("ph", 0))
        rainfall = float(data.get("rainfall", 0))
        
        # Prepare feature object for prediction
        # Use pandas DataFrame to avoid sklearn feature names warning
        import pandas as pd
        features = pd.DataFrame([[n, p, k, temp, humidity, ph, rainfall]], 
                                columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
        
        # Predict using the loaded model
        prediction = model.predict(features)
        recommended_crop = prediction[0]
        
        return {
            "recommendations": [recommended_crop],
            "advice": f"Based on your soil and weather conditions, we recommend planting {recommended_crop}."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "advisory-service", "model_loaded": model is not None}
