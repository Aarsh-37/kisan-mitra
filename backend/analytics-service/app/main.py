import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Crop Analytics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory event log
events = []

class EventLog(BaseModel):
    user_id: str
    event_type: str  # e.g., 'CROP_PREDICTION', 'PEST_ANALYSIS'
    metadata: dict

@app.post("/log")
async def log_event(event: EventLog):
    events.append(event.dict())
    logger.info(f"EVENT LOGGED: {event.event_type} by User {event.user_id}")
    return {"status": "success"}

@app.get("/stats")
async def get_stats():
    if not events:
        return {"total_events": 0, "by_type": {}}
    
    df = pd.DataFrame(events)
    stats = {
        "total_events": len(events),
        "by_type": df['event_type'].value_counts().to_dict(),
        "unique_users": int(df['user_id'].nunique())
    }
    return stats

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "analytics-service", "logged_events": len(events)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)
