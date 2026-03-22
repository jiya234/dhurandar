from flask import Flask, request, jsonify
import numpy as np
import requests
import os
from dotenv import load_dotenv
import pandas as pd
import joblib
from flask_cors import CORS

# ---------------------------------
# INIT
# ---------------------------------
load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------------------------
# LOAD MODELS
# ---------------------------------
season_model = joblib.load("models/season_model.pkl")

soil_model = joblib.load("models/soil_health_model.pkl")
nutrient_model = joblib.load("models/nutrient_deficiency_model.pkl")
scaler = joblib.load("models/soil_scaler.pkl")

# crop labels
crop_labels = ['groundnut', 'maize', 'mustard', 'pea', 'pearl millet', 'potato', 'rice']

# ---------------------------------
# WEATHER API
# ---------------------------------
def get_weather(city):
    api_key = os.getenv("WEATHER_API_KEY")

    if not api_key:
        return None, None

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    try:
        res = requests.get(url)
        data = res.json()

        if res.status_code != 200:
            return None, None

        return data["main"]["temp"], data["main"]["humidity"]

    except:
        return None, None


# ---------------------------------
# FEATURE BUILDER
# ---------------------------------
def build_features(N, P, K, ph, rainfall, temp, humidity):

    npk_total = N + P + K
    soil_fertility = 0.4*N + 0.3*P + 0.3*K

    n_p_ratio = N / (P + 1)
    n_k_ratio = N / (K + 1)
    p_k_ratio = P / (K + 1)

    water_index = rainfall * humidity
    gdd_approx = temp - 10

    season_rabi = 1

    return np.array([[  
        N, P, K,
        temp, humidity,
        ph, rainfall,
        npk_total,
        soil_fertility,
        n_p_ratio,
        n_k_ratio,
        p_k_ratio,
        water_index,
        gdd_approx,
        season_rabi
    ]])

# ---------------------------------
# SOIL HELPERS
# ---------------------------------
def soil_category(score):
    if score < 40:
        return "Poor"
    elif score < 70:
        return "Moderate"
    else:
        return "Healthy"


def soil_suggestions(category):
    if category == "Poor":
        return [
            "Increase Nitrogen using urea or compost",
            "Add organic matter to improve soil fertility",
            "Check soil salinity and drainage"
        ]
    elif category == "Moderate":
        return [
            "Maintain balanced fertilization",
            "Add organic compost regularly",
            "Monitor micronutrient levels"
        ]
    else:
        return [
            "Soil is healthy",
            "Maintain current nutrient balance",
            "Continue sustainable farming practices"
        ]

# ---------------------------------
# 🔥 CROP API
# ---------------------------------
@app.route('/predict', methods=['POST'])
def predict_api():
    try:
        data = request.json

        N = float(data['Nitrogen'])
        P = float(data['Phosphorus'])
        K = float(data['Potassium'])
        ph = float(data['Ph'])
        rainfall = float(data['Rainfall'])
        city = data['city']

        temp, humidity = get_weather(city)

        if temp is None:
            return jsonify({"error": "Weather API error"})

        features = build_features(N, P, K, ph, rainfall, temp, humidity)

        probs = season_model.predict_proba(features)[0]
        idx = np.argsort(probs)[-3:][::-1]

        result = []
        for i in idx:
            result.append({
                "crop": crop_labels[i],
                "confidence": float(round(probs[i]*100, 2))
            })

        return jsonify({
            "recommendations": result,
            "temperature": float(temp),
            "humidity": float(humidity)
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ---------------------------------
# 🔥 SOIL HEALTH API
# ---------------------------------
@app.route('/soil-health', methods=['POST'])
def soil_health_api():
    try:
        data = request.get_json()

        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        pH = float(data["pH"])
        EC = float(data["EC"])
        OC = float(data["OC"])
        S = float(data["S"])
        Fe = float(data["Fe"])
        Zn = float(data["Zn"])
        Mn = float(data["Mn"])
        Cu = float(data["Cu"])

        nutrient_sample = pd.DataFrame({
            "N":[N], "P":[P], "K":[K],
            "S":[S], "Fe":[Fe], "Zn":[Zn],
            "Mn":[Mn], "Cu":[Cu],
            "OC":[OC], "EC":[EC], "pH":[pH]
        })

        soil_sample = nutrient_sample[[
            "N","P","K","EC","OC","pH","S","Fe","Zn","Mn","Cu"
        ]]

        # soil prediction
        sample_scaled = scaler.transform(soil_sample)
        sample_scaled = pd.DataFrame(sample_scaled, columns=soil_sample.columns)

        predicted_shi = float(soil_model.predict(sample_scaled)[0])

        category = soil_category(predicted_shi)
        suggestions = soil_suggestions(category)

        # nutrient deficiency
        pred = nutrient_model.predict(nutrient_sample)[0]

        nutrients = [
            "Nitrogen","Phosphorus","Potassium",
            "Sulphur","Iron","Zinc","Manganese","Copper"
        ]

        deficiencies = []
        for nutrient, status in zip(nutrients, pred):
            if status == "Low":
                deficiencies.append(nutrient + " Low")

        return jsonify({
            "shi": round(predicted_shi, 2),
            "category": category,
            "deficiencies": deficiencies,
            "suggestions": suggestions
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ---------------------------------
# RUN
# ---------------------------------
if __name__ == "__main__":
    app.run(debug=True)