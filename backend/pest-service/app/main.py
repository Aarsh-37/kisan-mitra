import io
import os
import torch
import torchvision.transforms as transforms
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv

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

# Model setup
MODEL_PATH = "app/pest_model.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define classes (example placeholders)
CLASSES = ["Healthy", "Early Blight", "Late Blight", "Spider Mites", "Leaf Mold"]

# Transform for MobileNet
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

model = None

@app.on_event("startup")
async def load_model():
    global model
    # Load MobileNetV2
    model = mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
    # Adjust last layer for our CLASSES count
    model.classifier[1] = torch.nn.Linear(model.last_channel, len(CLASSES))
    
    if os.path.exists(MODEL_PATH):
        try:
            model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
            model.eval()
            print("Pest model weights loaded successfully.")
        except Exception as e:
            print(f"Error loading weights: {e}. Running with initialized weights.")
    else:
        print("Model weights not found. Running in DEMO mode.")
    
    model.to(DEVICE)

@app.post("/detect")
async def detect_pest(image: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model initializing")

    try:
        # Read and preprocess image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(DEVICE)

        # Inference
        with torch.no_grad():
            outputs = model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            confidence = torch.nn.functional.softmax(outputs, dim=1)[0][predicted].item()
        
        diagnosis = CLASSES[predicted.item()]
        
        # Treatment logic (simplified mapping)
        treatments = {
            "Healthy": "No treatment needed. Continue regular monitoring.",
            "Early Blight": "Apply Mancozeb or Copper-based fungicides. Improve air circulation.",
            "Late Blight": "Remove infected plants immediately. Apply Chlorothalonil.",
            "Spider Mites": "Use neem oil or insecticidal soap. Increase humidity.",
            "Leaf Mold": "Reduce humidity and improve spacing between plants."
        }

        return {
            "diagnosis": diagnosis,
            "confidence": round(confidence, 4),
            "treatment": treatments.get(diagnosis, "Consult an agricultural expert."),
            "service": "pest-service (PyTorch)"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pest-service", "device": str(DEVICE)}
