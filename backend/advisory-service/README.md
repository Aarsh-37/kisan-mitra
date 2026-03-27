# Crop Advisory Service 🌾

The **Crop Advisory Service** is a machine learning-powered microservice built with FastAPI. Its primary goal is to recommend the single most optimal crop for a farmer to plant based on chemical, soil, and environmental data.

## 🧠 Machine Learning Model

### Algorithm Used
The core recommendation engine uses the **Random Forest Classifier** (`RandomForestClassifier`) from the `scikit-learn` library, configured with an ensemble of 100 decision trees (`n_estimators=100`).

### Model Accuracy
Random Forest is highly accurate and resilient to overfitting. Based on standard splits (80% training / 20% testing) of the `Crop_recommendation.csv` dataset, the model consistently achieves a high performance **Accuracy of ~99.09%** on the validation benchmark.

### How the Model Works
The model relies on seven critical agricultural parameters to compute the classification probabilities for 22 different crop categories (e.g., rice, maize, chickpea, kidneybeans, etc.).

1. **Nitrogen (N)** - ratio of Nitrogen content in soil
2. **Phosphorous (P)** - ratio of Phosphorous content in soil
3. **Potassium (K)** - ratio of Potassium content in soil
4. **Temperature** - temperature in Celsius
5. **Humidity** - relative humidity in percentage
6. **pH** - pH value (acidity/alkalinity) of the soil
7. **Rainfall** - rainfall in millimeters

When a request travels to the `/recommend` API endpoint, the service:
1. Validates the 7 environmental inputs via Pydantic.
2. Converts them into a properly labeled Pandas DataFrame.
3. Passes the data through the pre-loaded `model.pkl` Random Forest model in-memory.
4. Outputs the crop with the highest prediction confidence as a direct recommendation.

## 🛠️ Service Architecture

- **Framework**: FastAPI
- **Model Loading**: The `model.pkl` object is efficiently loaded once via an asynchronous context lifecycle manager (`lifespan`) to prevent blocking and ensure ultra-low latency predictions on every POST request.
- **Error Handling**: Hardened with global exception capturing and `HTTP 500` status mappings to guarantee the API Gateway handles unexpected prediction errors securely. 

## 🚀 Usage

**Endpoint:** `POST /recommend`

**Sample Payload:**
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.8,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

**Response:**
```json
{
  "recommendations": ["rice"],
  "advice": "Based on your soil parameters and weather conditions, we recommend cultivating rice."
}
```
