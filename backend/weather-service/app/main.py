import os
import logging
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from cachetools import TTLCache
from typing import Optional

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Crop Weather Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "").strip()

# In-memory cache: max 100 cities, expire in 15 minutes (900 seconds)
weather_cache = TTLCache(maxsize=100, ttl=900)

@app.get("/weather/{city}")
async def get_weather(city: str):
    city = city.lower().strip()
    
    # Check cache
    if city in weather_cache:
        logger.info(f"Serving weather for {city} from cache.")
        return weather_cache[city]

    if not OPENWEATHER_API_KEY:
        logger.warning("OPENWEATHER_API_KEY missing. Returning mock data.")
        mock_data = {
            "name": city.capitalize(),
            "main": {"temp": 28.5, "humidity": 65},
            "weather": [{"description": "clear sky", "icon": "01d"}],
            "source": "Mock (API Key missing)"
        }
        return mock_data

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                data["source"] = "OpenWeather API"
                weather_cache[city] = data
                return data
            else:
                logger.error(f"Weather API error {resp.status_code} for {city}")
                return {
                    "name": city.capitalize(),
                    "main": {"temp": 22.0, "humidity": 70},
                    "weather": [{"description": "overcast clouds", "icon": "04d"}],
                    "source": f"Mock (API Error {resp.status_code})"
                }
        except Exception as e:
            logger.exception(f"Connection error fetching weather for {city}")
            return {
                "name": city.capitalize(),
                "main": {"temp": 25.0, "humidity": 60},
                "weather": [{"description": "scattered clouds", "icon": "03d"}],
                "source": "Mock (Connection Error)"
            }

@app.get("/alerts/{city}")
async def get_weather_alerts(city: str):
    # Placeholder for location-based alerts (e.g., heavy rain, frost warnings)
    # In a real implementation, this might query an IMD alert API or compute logic based on forecast
    return {
        "city": city,
        "alerts": [],
        "advice": "No severe weather alerts at the moment. Good time for irrigation."
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "weather-service",
        "cache_size": len(weather_cache)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
