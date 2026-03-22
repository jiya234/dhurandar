from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# load models
soil_model = joblib.load("models/soil_health_model.pkl")
nutrient_model = joblib.load("models/nutrient_deficiency_model.pkl")
scaler = joblib.load("models/soil_scaler.pkl")


# ----------------------------
# HELPERS
# ----------------------------
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


# ----------------------------
# 🔥 NEW API ROUTE FOR REACT
# ----------------------------
@app.route("/soil-health", methods=["POST"])
def soil_health_api():
    try:
        data = request.get_json()

        # INPUTS
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

        # dataframe for nutrient model
        nutrient_sample = pd.DataFrame({
            "N":[N], "P":[P], "K":[K],
            "S":[S], "Fe":[Fe], "Zn":[Zn],
            "Mn":[Mn], "Cu":[Cu],
            "OC":[OC], "EC":[EC], "pH":[pH]
        })

        # correct order for soil model
        soil_sample = nutrient_sample[[
            "N","P","K","EC","OC","pH","S","Fe","Zn","Mn","Cu"
        ]]

        # ---------- Soil Health ----------
        sample_scaled = scaler.transform(soil_sample)
        sample_scaled = pd.DataFrame(sample_scaled, columns=soil_sample.columns)

        predicted_shi = float(soil_model.predict(sample_scaled)[0])

        category = soil_category(predicted_shi)
        suggestions = soil_suggestions(category)

        # ---------- Nutrient Deficiency ----------
        pred = nutrient_model.predict(nutrient_sample)[0]

        nutrients = [
            "Nitrogen","Phosphorus","Potassium",
            "Sulphur","Iron","Zinc","Manganese","Copper"
        ]

        deficiencies = []

        for nutrient, status in zip(nutrients, pred):
            if status == "Low":
                deficiencies.append(nutrient + " Low")

        # FINAL RESPONSE
        return jsonify({
            "shi": round(predicted_shi, 2),
            "category": category,
            "deficiencies": deficiencies,
            "suggestions": suggestions
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ----------------------------
# RUN
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)