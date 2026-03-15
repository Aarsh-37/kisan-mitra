import io
import os
import torch
import torchvision.transforms as transforms
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv
import google.generativeai as genai
import json

load_dotenv(find_dotenv())

app = FastAPI(title="Smart Crop Pest Detection Service")

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
gemini_model = None

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Gemini Vision AI initialized successfully for Pest Detection")
    except Exception as e:
        print(f"❌ Failed to initialize Gemini Vision: {e}")

# Fallback PyTorch Model setup
MODEL_PATH = "app/pest_model.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CLASSES = ['aphids', 'armyworm', 'beetle', 'bollworm', 'grasshopper', 'mites', 'mosquito', 'sawfly', 'stem_borer']

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

baseline_model = None

@app.on_event("startup")
async def load_baseline_model():
    global baseline_model
    from torchvision.models import resnet18, ResNet18_Weights
    baseline_model = resnet18(weights=ResNet18_Weights.DEFAULT)
    num_ftrs = baseline_model.fc.in_features
    baseline_model.fc = torch.nn.Linear(num_ftrs, len(CLASSES))
    
    if os.path.exists(MODEL_PATH):
        try:
            baseline_model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
            baseline_model.eval()
            print("Pest model weights loaded successfully.")
        except Exception as e:
            print(f"Error loading weights: {e}. Running with initialized weights.")
    else:
        print("Model weights not found. Baseline running in DEMO mode.")
    
    baseline_model.to(DEVICE)

@app.post("/detect")
async def detect_pest(image: UploadFile = File(...)):
    contents = await image.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")

    # Primary: Attempt Gemini Vision API
    if gemini_model:
        try:
            prompt = """
            Analyze this image of a plant leaf/crop. Identify if it is healthy or if it has a disease/pest. 
            Respond strictly in the following JSON format:
            {
                "diagnosis": "Name of the disease or 'Healthy'",
                "confidence": "A value between 0.80 and 0.99 indicating confidence",
                "treatment": "Brief, actionable advice or treatment plan. Limit to 2 sentences."
            }
            """
            response = gemini_model.generate_content([prompt, img])
            # Parse the JSON response
            resp_text = response.text.strip()
            if resp_text.startswith("```json"):
                resp_text = resp_text[7:-3]
            elif resp_text.startswith("```"):
                resp_text = resp_text[3:-3]
            
            result = json.loads(resp_text)
            return {
                "diagnosis": result.get("diagnosis", "Unknown Disease"),
                "confidence": float(result.get("confidence", 0.85)),
                "treatment": result.get("treatment", "Consult a local agricultural expert."),
                "service": "pest-service (Gemini Vision)"
            }
        except Exception as e:
            print(f"Gemini Vision failed ({e}), falling back to PyTorch baseline.")

    # Fallback: PyTorch Baseline Model
    if baseline_model is None:
        raise HTTPException(status_code=503, detail="Model initializing")

    try:
        img_tensor = transform(img).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            outputs = baseline_model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            confidence = torch.nn.functional.softmax(outputs, dim=1)[0][predicted].item()
        
        diagnosis = CLASSES[predicted.item()]
        treatments = {
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

        return {
            "diagnosis": diagnosis,
            "confidence": round(confidence, 4),
            "treatment": treatments.get(diagnosis, "Consult an agricultural expert."),
            "service": "pest-service (CNN Model)"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "pest-service",
        "vision_ai": "active" if gemini_model else "inactive"
    }
