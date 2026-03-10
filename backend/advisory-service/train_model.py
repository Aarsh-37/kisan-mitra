import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle
import os

def train():
    print("Loading data...")
    # Get absolute path for reliability
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, 'Crop_recommendation.csv')
    
    df = pd.read_csv(data_path)
    print(f"Dataset shape: {df.shape}")
    
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestClassifier...")
    # Use RandomForest for good out-of-the-box accuracy and stability
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy on Test Set: {acc * 100:.2f}%")
    
    # Create the app directory if it doesn't exist
    app_dir = os.path.join(base_dir, 'app')
    os.makedirs(app_dir, exist_ok=True)
    
    model_path = os.path.join(app_dir, 'model.pkl')
    
    print(f"Saving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print("Optimization and saving complete.")

if __name__ == "__main__":
    train()
