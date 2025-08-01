import os
import cv2
import numpy as np
import joblib
from ultralytics import YOLO
from skimage.feature import graycomatrix, graycoprops
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import base64
from PIL import Image
import io
import traceback

app = Flask(__name__)
CORS(app)

# === CONFIGURATION ===
model_dir = os.path.join(os.path.dirname(__file__), 'models')
model_path = os.path.join(model_dir, 'svm_best_model.joblib')
scaler_path = os.path.join(model_dir, 'scaler_best.joblib')
encoder_path = os.path.join(model_dir, 'label_encoder_best.joblib')

label_map = {
    0: {"common": "Abalone Mushroom", "scientific": "Pleurotus cystidiosus"},
    1: {"common": "Pink Oyster Mushroom", "scientific": "Pleurotus djamor"},
    2: {"common": "Bhutan Oyster Mushroom", "scientific": "Pleurotus eous"},
    3: {"common": "American Oyster Mushroom", "scientific": "Pleurotus ostreatus"}
}

padding = 10
yolo_model = YOLO('yolov5su.pt')

# === Load model components ===
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
encoder = joblib.load(encoder_path)

# === Utility functions ===
def enhance_contrast(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    v_eq = cv2.equalizeHist(v)
    return cv2.cvtColor(cv2.merge((h, s, v_eq)), cv2.COLOR_HSV2BGR)

def compute_entropy(glcm):
    glcm_norm = glcm.astype(np.float32) / glcm.sum()
    return -np.sum(glcm_norm * np.log2(glcm_norm + 1e-10))

def try_yolo_segmentation(img):
    img_resized = cv2.resize(cv2.medianBlur(img, 3), (256, 256))
    results = yolo_model.predict(source=img_resized, conf=0.1, verbose=False)
    boxes = results[0].boxes
    if boxes is None or boxes.xyxy.shape[0] == 0:
        return None
    bbox = boxes.xyxy.cpu().numpy()[0]
    h, w = img_resized.shape[:2]
    x1, y1 = max(0, int(bbox[0]) - padding), max(0, int(bbox[1]) - padding)
    x2, y2 = min(w, int(bbox[2]) + padding), min(h, int(bbox[3]) + padding)
    rect = (x1, y1, x2 - x1, y2 - y1)
    mask = np.zeros((h, w), np.uint8)
    bgModel = np.zeros((1, 65), np.float64)
    fgModel = np.zeros((1, 65), np.float64)
    try:
        cv2.grabCut(img_resized, mask, rect, bgModel, fgModel, 5, cv2.GC_INIT_WITH_RECT)
        final_mask = np.where((mask == cv2.GC_FGD)|(mask == cv2.GC_PR_FGD), 1, 0).astype(np.uint8)
        return img_resized * final_mask[:, :, np.newaxis]
    except:
        print("GrabCut failed — fallback to central crop.")
        return None

def process_image(img_bgr):
    segmented = try_yolo_segmentation(img_bgr)
    if segmented is None:
        img_resized = cv2.resize(cv2.medianBlur(img_bgr, 3), (256, 256))
        h, w = img_resized.shape[:2]
        segmented = img_resized[h//4:h*3//4, w//4:w*3//4]

    enhanced = enhance_contrast(segmented)
    gray = cv2.cvtColor(enhanced, cv2.COLOR_BGR2GRAY)

    # GLCM features
    glcm = graycomatrix(gray, [1], [0], symmetric=True, normed=True)
    contrast    = graycoprops(glcm, 'contrast')[0, 0]
    correlation = graycoprops(glcm, 'correlation')[0, 0]
    energy      = graycoprops(glcm, 'energy')[0, 0]
    homogeneity = graycoprops(glcm, 'homogeneity')[0, 0]
    entropy     = compute_entropy(glcm)

    # Color stats
    mean_b, mean_g, mean_r = cv2.mean(enhanced)[:3]
    std_b  = np.std(enhanced[:, :, 0])
    std_g  = np.std(enhanced[:, :, 1])
    std_r  = np.std(enhanced[:, :, 2])

    hsv = cv2.cvtColor(enhanced, cv2.COLOR_BGR2HSV)
    mean_hue = np.mean(hsv[:, :, 0])
    mean_sat = np.mean(hsv[:, :, 1])
    mean_val = np.mean(hsv[:, :, 2])

    # Statistical texture features
    gray_f32    = gray.astype(np.float32)
    rms         = np.sqrt(np.mean(np.square(gray_f32)))
    smoothness  = 1 - (1 / (1 + np.var(gray_f32)))
    skewness    = np.mean(((gray_f32 - np.mean(gray_f32))**3)) / (np.std(gray_f32)**3 + 1e-6)
    variance    = np.var(gray_f32)
    kurtosis    = np.mean(((gray_f32 - np.mean(gray_f32))**4)) / (np.std(gray_f32)**4 + 1e-6)

    features = [
        mean_r, mean_g, mean_b,
        std_r, std_g, std_b,
        mean_hue, mean_sat, mean_val,
        contrast, correlation, energy, entropy, homogeneity,
        rms, smoothness, skewness, variance, kurtosis
    ]

    return features, {
        'colorMean': [float(mean_r), float(mean_g), float(mean_b)],
        'textureFeatures': {
            'contrast': float(contrast),
            'correlation': float(correlation),
            'energy': float(energy),
            'homogeneity': float(homogeneity),
            'entropy': float(entropy),
            'rms': float(rms),
            'smoothness': float(smoothness),
            'skewness': float(skewness),
            'variance': float(variance),
            'kurtosis': float(kurtosis)
        }
    }

@app.route('/predict', methods=['POST'])
def predict_mushroom():
    try:
        data = request.get_json()
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        pil_image = Image.open(io.BytesIO(image_bytes))
        img_bgr = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

        features, feature_details = process_image(img_bgr)
        scaled = scaler.transform([features])
        pred_id = model.predict(scaled)[0]
        pred_label = encoder.inverse_transform([pred_id])[0]
        
        # Ensure pred_id is an integer and handle edge cases
        pred_id = int(pred_id)
        mapped_label = label_map.get(pred_id, {"common": "Unknown Mushroom Type", "scientific": "Unknown species"})
        
        pred_proba = model.predict_proba(scaled)[0]
        confidence = float(np.max(pred_proba) * 100)
        
        # Check if confidence is too low or if there's no clear winner
        sorted_proba = sorted(pred_proba, reverse=True)
        confidence_diff = sorted_proba[0] - sorted_proba[1] if len(sorted_proba) > 1 else 0
        
        # If confidence is too low OR if the top two predictions are too close
        if confidence < 50.0 or confidence_diff < 0.2:  # Adjustable thresholds
            mapped_label = {"common": "Unknown Mushroom Type", "scientific": "Unknown species"}
            confidence = 0.0

        return jsonify({
            'mushroomType': mapped_label,
            'confidence': round(confidence, 1),
            'classId': pred_id,
            'features': feature_details
        })
    except Exception as e:
        print('--- Exception in /predict endpoint ---')
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'Mushroom ML API is running'})

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join('dist', path)):
        return send_from_directory('dist', path)
    else:
        return send_from_directory('dist', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)