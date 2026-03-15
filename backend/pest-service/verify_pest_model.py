import torch
import torchvision.transforms as transforms
from torchvision.models import resnet18
from PIL import Image
import os
import requests

CLASSES = ['aphids', 'armyworm', 'beetle', 'bollworm', 'grasshopper', 'mites', 'mosquito', 'sawfly', 'stem_borer']
MODEL_PATH = "app/pest_model.pth"
TEST_DATA_DIR = "../../pest/test"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def verify_local_model():
    print("--- Verifying Local Model Load ---")
    model = resnet18()
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, len(CLASSES))
    
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model file {MODEL_PATH} not found.")
        return
    
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    model.to(DEVICE)
    print("Model loaded successfully.")

    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    correct = 0
    total = 0
    
    # Test one image from each class
    for cls in CLASSES:
        cls_dir = os.path.join(TEST_DATA_DIR, cls)
        if not os.path.exists(cls_dir):
            continue
        
        img_name = os.listdir(cls_dir)[0]
        img_path = os.path.join(cls_dir, img_name)
        
        img = Image.open(img_path).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            outputs = model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            
        pred_label = CLASSES[predicted.item()]
        print(f"Path: {cls}/{img_name} | Actual: {cls} | Predicted: {pred_label}")
        
        if pred_label == cls:
            correct += 1
        total += 1
    
    print(f"\nFinal Accuracy on sample: {correct}/{total} ({100*correct/total:.2f}%)")

if __name__ == "__main__":
    verify_local_model()
