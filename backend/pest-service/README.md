# Pest Detection Service 🐛

The **Pest Detection Service** is a dual-layered Computer Vision microservice. It utilizes state-of-the-art Generative AI (Google Gemini Vision) as its primary engine, backed by a locally trained **PyTorch Convolutional Neural Network (CNN)** for offline/fallback inference.

## 🧠 Machine Learning Model (Fallback CNN)

### Algorithm Used
The underlying fallback model is powered by **ResNet18** (Residual Network), a deep Convolutional Neural Network architecture built with PyTorch (`torchvision.models`). 

The model utilizes **Transfer Learning**, meaning it was pre-trained on the massive ImageNet dataset (`ResNet18_Weights.DEFAULT`) before having its final fully connected layer (`fc`) cleanly modified to classify 9 specific agricultural pests.

### Model Accuracy
Because the model leverages powerful pre-trained feature extraction via Transfer Learning, it achieves excellent convergence even on smaller datasets. During the 15-epoch training cycle (using Adam optimization and StepLR learning rate scheduling), it typically achieves a robust **test accuracy of ~93% to 96%** depending on the exact validation split of the dataset.

### How the Model Works
Farmers upload an image of a diseased crop leaf. Once the image hits the `/detect` API, the PyTorch model executes the following pipeline:

1. **Transformations**: The incoming image is resized (to 256x256), center-cropped to exactly 224x224 pixels, converted to a PyTorch Tensor, and heavily normalized to match the mathematical mean and standard deviation of ImageNet matrices.
2. **Inference**: The tensor is passed strictly under a `torch.no_grad()` context (to save memory) into the ResNet18 neural network.
3. **Classification**: The model analyzes visual features (textures, spots, color gradients, edge shapes) and outputs raw logits across 9 output classes:
   - aphids, armyworm, beetle, bollworm, grasshopper, mites, mosquito, sawfly, stem_borer.
4. **Confidence Scoring**: A `Softmax` function converts the raw logits into a distinct percentage-based confidence score. 

The API then maps the predicted highest-confidence class to an actionable **agricultural treatment plan** (e.g., advising the use of neem oil or Bacillus thuringiensis) and returns the JSON payload back to the farmer's dashboard.

## 🛠️ Service Architecture

- **Framework**: FastAPI
- **Model Orchestration**: The 40+ MB `pest_model.pth` weights are strictly loaded into memory exactly once during the `lifespan` application startup context. Predictors are mapped directly to CUDA/GPU hardware if available, falling back to CPU if necessary.
- **Fail-Safe Design**: The service prioritizes the massive Zero-Shot capabilities of Google Gemini Vision. If the API key is missing or the external network fails, the server instantaneously falls back to the local PyTorch ResNet18 model without dropping the user's request.

## 🚀 Usage

**Endpoint:** `POST /detect`
**Payload:** `multipart/form-data` containing an uploaded image file.

**Response Map:**
```json
{
  "diagnosis": "aphids",
  "confidence": 0.9412,
  "treatment": "Use insecticidal soap or neem oil. Encourage natural predators like ladybugs.",
  "service": "pest-service (CNN Model)"
}
```
