# Mushroom Identification Backend

This Flask API wraps your ML model for mushroom identification.

## Setup Instructions

1. **Install Dependencies:**
```bash
pip install -r requirements.txt
```

2. **Update Model Paths:**
Edit `app.py` and update the `model_dir` path to match your actual model location:
```python
model_dir = r'F:/Campus/4.2/Research/After Progress presentation/Models/SVM'
```

3. **Download YOLO Model:**
The app will automatically download `yolov5s.pt` on first run, or place your custom YOLO model in the same directory.

4. **Run the API:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /predict
Accepts a base64 encoded image and returns mushroom prediction.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

**Response:**
```json
{
  "mushroomType": "Button Mushroom",
  "confidence": 94.7,
  "classId": 5,
  "features": {
    "colorMean": [145.2, 123.8, 98.5],
    "textureFeatures": {
      "contrast": 0.234,
      "correlation": 0.876,
      "energy": 0.145,
      "homogeneity": 0.678,
      "entropy": 4.321
    }
  }
}
```

### GET /health
Health check endpoint.

## Integration with Frontend

The frontend is already configured to call this API. Just make sure the backend is running on `http://localhost:5000` before testing the frontend.