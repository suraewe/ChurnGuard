from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import datetime
import os

app = Flask(__name__)
CORS(app)  # This allows your frontend to talk to this API

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "models", "churn_model.pkl")

# Load the model
try:
    model = joblib.load(model_path)
    print(f"✅ Model loaded successfully from {model_path}")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# Encoding maps
geo_map = {"France": 0, "Germany": 1, "Spain": 2}
gender_map = {"Female": 0, "Male": 1}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(f"Received prediction request for: {data.get('CustomerName', 'Unknown')}")
        
        # Extract and format data for the model
        input_data = np.array([[
            data.get('CreditScore', 600),
            geo_map.get(data.get('Geography', 'France'), 0),
            gender_map.get(data.get('Gender', 'Female'), 0),
            data.get('Age', 35),
            data.get('Tenure', 5),
            data.get('Balance', 0.0),
            data.get('NumOfProducts', 1),
            1 if data.get('HasCrCard') else 0,
            1 if data.get('IsActiveMember') else 0,
            data.get('EstimatedSalary', 50000.0)
        ]])

        # Get prediction and probability
        prediction = int(model.predict(input_data)[0])
        probability = float(model.predict_proba(input_data)[0][1])
        
        # Calculate risk score (0-100)
        risk_score = round(probability * 100, 2)

        # Prepare response
        response = {
            "prediction": prediction,
            "probability": probability,
            "riskScore": risk_score,
            "confidence": 0.92,
            "timestamp": datetime.datetime.now().isoformat(),
            "factors": [
                {"label": "Age", "impact": "medium", "direction": "risk" if data.get('Age', 35) > 40 else "safe"},
                {"label": "Activity", "impact": "high", "direction": "safe" if data.get('IsActiveMember') else "risk"}
            ]
        }
        
        return jsonify(response)

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

if __name__ == '__main__':
    print("🚀 Starting ChurnGuard API on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
