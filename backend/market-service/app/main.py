import logging
import asyncio
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Crop Market Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data store
MARKET_DATA = {
    "Wheat": [
        {"mandi": "Nagpur", "price": 2500, "unit": "Quintal", "trend": "Up"},
        {"mandi": "Pune", "price": 2450, "unit": "Quintal", "trend": "Stable"},
    ],
    "Rice": [
        {"mandi": "Gondia", "price": 3200, "unit": "Quintal", "trend": "Up"},
        {"mandi": "Raipur", "price": 3100, "unit": "Quintal", "trend": "Down"},
    ]
}

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.get("/market-prices/{commodity}")
async def get_market_prices(commodity: str):
    commodity = commodity.capitalize()
    prices = MARKET_DATA.get(commodity, [])
    return {
        "commodity": commodity,
        "prices": prices,
        "timestamp": "Real-time"
    }

@app.websocket("/ws/prices")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Simulate real-time price fluctuations
            await asyncio.sleep(10)
            commodity = random.choice(list(MARKET_DATA.keys()))
            item = random.choice(MARKET_DATA[commodity])
            change = random.randint(-50, 50)
            item["price"] += change
            item["trend"] = "Up" if change > 0 else "Down" if change < 0 else "Stable"
            
            await manager.broadcast({
                "type": "PRICE_UPDATE",
                "commodity": commodity,
                "data": item
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "market-service", "connections": len(manager.active_connections)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)
