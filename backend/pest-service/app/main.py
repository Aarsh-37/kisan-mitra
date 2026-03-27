import io
import os
import json
import logging
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet18, ResNet18_Weights
from PIL import Image
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Constants and Configurations
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MODEL_PATH = "app/pest_model.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CLASSES = ['aphids', 'armyworm', 'beetle', 'bollworm', 'grasshopper', 'mites', 'mosquito', 'sawfly', 'stem_borer']

TREATMENTS = {
    "aphids": "Use insecticidal soap or neem oil. Encourage natural predators like ladybugs.",
    "armyworm": "Apply Bacillus thuringiensis (Bt) or Spinosad. Plowing field after harvest helps.",
    "beetle": "Handpick large beetles. Use floating row covers or apply pyrethrin.",
    "bollworm": "Deploy pheromone traps. Apply appropriate insecticides like indoxacarb.",
    "grasshopper": "Maintain a clear buffer zone around fields. Use Nosema locustae baits.",
    "mites": "Increase humidity. Use miticides or sulfur-based sprays.",
    "mosquito": "Eliminate standing water. Use Bti (Bacillus thuringiensis israelensis) in ponds.",
    "sawfly": "Prune infested branches. Apply insecticidal soap or spinosad.",
    "stem_borer": "Remove and destroy infested stalks. Use systemic insecticides."
}

# Image Transforms
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Gemini Component
    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            ml_models["gemini"] = genai.GenerativeModel('gemini-1.5-flash')
            logger.info("Gemini Vision AI initialized successfully for Pest Detection.")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Vision: {e}")
    else:
        logger.warning("GEMINI_API_KEY not found. Operating without advanced Vision AI.")

    # Initialize Fallback PyTorch CNN Model
    try:
        baseline_model = resnet18(weights=ResNet18_Weights.DEFAULT)
        num_ftrs = baseline_model.fc.in_features
        baseline_model.fc = torch.nn.Linear(num_ftrs, len(CLASSES))
        
        if os.path.exists(MODEL_PATH):
            baseline_model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
            baseline_model.eval()
            logger.info("PyTorch pest CNN weights loaded successfully.")
        else:
            logger.warning(f"Model weights not found at {MODEL_PATH}. Baseline running initialized weights.")
        
        baseline_model.to(DEVICE)
        ml_models["baseline"] = baseline_model
    except Exception as e:
        logger.error(f"Failed to initialize baseline PyTorch model: {e}")

    yield
    ml_models.clear()
    logger.info("Service shutting down.")

app = FastAPI(title="Smart Crop Pest Detection Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect_pest(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        logger.error(f"Failed to process uploaded image: {e}")
        raise HTTPException(status_code=400, detail="Invalid image file provided.")

    gemini_model = ml_models.get("gemini")
    
    # Primary Strategy: Attempt Gemini Vision API
    if gemini_model:
        try:
            prompt = (
                "Analyze this image of a plant leaf/crop. Identify if it is healthy or if it has a disease/pest. "
                "Respond strictly in the following JSON format: "
                '{"diagnosis": "Name of the disease or Healthy", "confidence": "0.80 to 0.99", '
                '"treatment": "Brief, actionable advice or treatment plan. Limit to 2 sentences."}'
            )
            response = gemini_model.generate_content([prompt, img])
            
            # Safely parse JSON from markdown representation
            resp_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            result = json.loads(resp_text)
            
            return {
                "diagnosis": str(result.get("diagnosis", "Unknown Disease")),
                "confidence": float(result.get("confidence", 0.85)),
                "treatment": str(result.get("treatment", "Consult a local agricultural expert.")),
                "service": "pest-service (Gemini Vision)"
            }
        except Exception as e:
            logger.error(f"Gemini Vision inference failed ({e}), initiating fallback sequence.")

    # Fallback Strategy: PyTorch CNN Baseline Model
    baseline_model = ml_models.get("baseline")
    if not baseline_model:
        raise HTTPException(status_code=503, detail="Pest detection model is currently unavailable.")

    try:
        img_tensor = transform(img).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            outputs = baseline_model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            confidence = torch.nn.functional.softmax(outputs, dim=1)[0][predicted].item()
        
        diagnosis = CLASSES[predicted.item()]
        treatment = TREATMENTS.get(diagnosis, "Consult an agricultural expert.")

        return {
            "diagnosis": diagnosis,
            "confidence": round(float(confidence), 4),
            "treatment": treatment,
            "service": "pest-service (CNN Model)"
        }
    except Exception as e:
        logger.error(f"CNN baseline inference error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during image classification.")

@app.get("/health")
async def health_check():
    return {
        "status": "Healthy",
        "service": "pest-service",
        "vision_ai": "Active" if "gemini" in ml_models else "Inactive",
        "cnn_fallback": "Active" if "baseline" in ml_models else "Inactive"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
