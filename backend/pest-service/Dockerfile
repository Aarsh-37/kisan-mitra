FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
COPY . .
EXPOSE 8003
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8003}"
