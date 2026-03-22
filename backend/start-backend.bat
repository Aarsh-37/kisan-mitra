@echo off
echo Starting Smart Crop Advisory System Backend Services...
echo =======================================================
echo This will open 4 new windows for the Python microservices.
echo Keep this terminal open for the API Gateway.
echo =======================================================

echo Starting Advisory Service (Port 8002)...
start "Advisory Service" cmd /k "cd advisory-service && uvicorn app.main:app --port 8002 --reload"

echo Starting Pest Service (Port 8003)...
start "Pest Service" cmd /k "cd pest-service && uvicorn app.main:app --port 8003 --reload"

echo Starting Data Service (Port 8004) - Handles Weather API...
start "Data Service" cmd /k "cd data-service && uvicorn app.main:app --port 8004 --reload"

echo Starting Chatbot Service (Port 8005)...
start "Chatbot Service" cmd /k "cd chatbot-service && uvicorn app.main:app --port 8005 --reload"

echo =======================================================
echo All Python services launched! 
echo Now starting the Node.js API Gateway (Port 5000)...
echo =======================================================

node index.js
