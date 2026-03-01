from flask import Flask, request, render_template
import numpy as np
import pickle
import requests

app = Flask(__name__)

# ----------------------------
# Load BOTH Models
# ----------------------------

multi_model = pickle.load(open("multidataset_model.pkl", "rb"))
multi_scaler = pickle.load(open("multidataset_scaler.pkl", "rb"))

ds3_model = pickle.load(open("dataset3_model.pkl", "rb"))
ds3_scaler = pickle.load(open("dataset3_scaler.pkl", "rb"))

# ----------------------------
# Weather API
# ----------------------------

def get_weather(city):
    api_key = "43ef35045c8f53ed9fd6a462d0354108"

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code != 200:
            return None, None

        temperature = data["main"]["temp"]
        humidity = data["main"]["humidity"]

        return temperature, humidity

    except:
        return None, None


# ----------------------------
# Routes
# ----------------------------

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Form Inputs
        N = float(request.form['Nitrogen'])
        P = float(request.form['Phosphorus'])
        K = float(request.form['Potassium'])
        ph = float(request.form['Ph'])
        rainfall = float(request.form['Rainfall'])
        city = request.form['city']
        state = request.form['state']
        district = request.form['district']
        model_choice = request.form['model_choice']

        # Weather Fetch
        temp, humidity = get_weather(city)

        if temp is None:
            return render_template("index.html", result="❌ Weather API error.")

        # Feature order MUST match training
        features = np.array([[N, P, K, temp, humidity, ph, rainfall]])
        
           # ----------------------------
        # Select Model
        # ----------------------------

        if model_choice == "multidataset":
            model = multi_model
            scaler = multi_scaler
            model_name = "Multi Dataset Model"
        else:
            model = ds3_model
            scaler = ds3_scaler
            model_name = "Actual Dataset Model"

        # Scale
        features_scaled = scaler.transform(features)

        # Predict probabilities
        probabilities = model.predict_proba(features_scaled)[0]

        # Top 3 crops
        top3_indices = np.argsort(probabilities)[-3:][::-1]
        top3_crops = model.classes_[top3_indices]
        top3_scores = probabilities[top3_indices]

        recommendations = []
        for crop, score in zip(top3_crops, top3_scores):
            recommendations.append({
            "crop": crop.capitalize(),
             "confidence": round(score * 100, 2)
            })
    except Exception as e:
        print("Error:", e)
        recommendations = [{"crop": "Error", "confidence": 0}]

    return render_template(
        "index.html",
        recommendations=recommendations,
        model_name=model_name,
        N=N,
        P=P,
        K=K,
        ph=ph,
        rainfall=rainfall,
        district=district,
        city=city,
        state=state,
        temp=temp,
        humidity=humidity
    )


if __name__ == "__main__":
    app.run(debug=True)