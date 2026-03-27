import os
import pickle
import logging
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "rb") as f:
                ml_models["crop_model"] = pickle.load(f)
            logger.info("Advisory ML model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")
    else:
        logger.warning(f"Model file not found at {MODEL_PATH}")
    
    yield
    ml_models.clear()
    logger.info("Service shutting down.")

app = FastAPI(title="Smart Crop Advisory Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CropRequest(BaseModel):
    N: float = Field(default=0.0, description="Nitrogen content in soil")
    P: float = Field(default=0.0, description="Phosphorous content in soil")
    K: float = Field(default=0.0, description="Potassium content in soil")
    temperature: float = Field(default=0.0, description="Temperature in Celsius")
    humidity: float = Field(default=0.0, description="Relative humidity in percentage")
    ph: float = Field(default=0.0, description="pH value of the soil")
    rainfall: float = Field(default=0.0, description="Rainfall in mm")

@app.post("/recommend")
async def recommend_crop(request: CropRequest):
    model = ml_models.get("crop_model")
    if model is None:
        raise HTTPException(status_code=503, detail="Model is currently unavailable.")
    
    try:
        features = pd.DataFrame(
            [[request.N, request.P, request.K, request.temperature, request.humidity, request.ph, request.rainfall]], 
            columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        )
        
        prediction = model.predict(features)
        recommended_crop = str(prediction[0])
        
        return {
            "recommendations": [recommended_crop],
            "advice": f"Based on your soil parameters and weather conditions, we recommend cultivating {recommended_crop}."
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during crop prediction.")

@app.get("/health")
async def health_check():
    return {
        "status": "Healthy",
        "service": "advisory-service",
        "model_loaded": "crop_model" in ml_models
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
