from fastapi import FastAPI, HTTPException
import httpx
import os
from dotenv import load_dotenv, find_dotenv

from fastapi.middleware.cors import CORSMiddleware

load_dotenv(find_dotenv())

app = FastAPI(title="Smart Crop Data Service")

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
print(f"DEBUG: Weather API Key loaded: {'Yes' if OPENWEATHER_API_KEY else 'No'}")

@app.get("/weather/{city}")
async def get_weather(city: str):
    if not OPENWEATHER_API_KEY or OPENWEATHER_API_KEY.strip() == "":
        return {
            "name": city,
            "main": {"temp": 28.5, "humidity": 65},
            "weather": [{"description": "clear sky", "icon": "01d"}],
            "source": "Mock (API Key missing)"
        }
    
    api_key = OPENWEATHER_API_KEY.strip() if OPENWEATHER_API_KEY else ""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url)
            if resp.status_code != 200:
                # Return mock if API fails (e.g. invalid key)
                return {
                    "name": city,
                    "main": {"temp": 22.0, "humidity": 70},
                    "weather": [{"description": "overcast clouds", "icon": "04d"}],
                    "source": f"Mock (API Error {resp.status_code})"
                }
            return resp.json()
        except Exception as e:
            return {
                "name": city,
                "main": {"temp": 25.0, "humidity": 60},
                "weather": [{"description": "scattered clouds", "icon": "03d"}],
                "source": f"Mock (Connection Error)"
            }

@app.get("/market-prices/{commodity}")
async def get_market_prices(commodity: str):
    # Mock data for eNAM integration
    return {
        "commodity": commodity,
        "prices": [
            {"mandi": "Nagpur", "price": "2500", "unit": "Quintal", "trend": "Up"},
            {"mandi": "Pune", "price": "2450", "unit": "Quintal", "trend": "Stable"}
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "data-service"}
