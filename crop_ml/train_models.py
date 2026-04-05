import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

os.makedirs("models", exist_ok=True)

# Dummy training data - N, P, K, temp, humidity, ph, rainfall, npk_total, soil_fertility, n_p_ratio, n_k_ratio, p_k_ratio, water_index, gdd_approx, season_rabi
np.random.seed(42)
n = 500

data = {
    'N': np.random.randint(50, 300, n),
    'P': np.random.uniform(5, 50, n),
    'K': np.random.randint(50, 300, n),
    'temp': np.random.uniform(15, 40, n),
    'humidity': np.random.uniform(30, 90, n),
    'ph': np.random.uniform(5.5, 8.5, n),
    'rainfall': np.random.uniform(0, 200, n),
}
df = pd.DataFrame(data)
df['npk_total'] = df['N'] + df['P'] + df['K']
df['soil_fertility'] = 0.4*df['N'] + 0.3*df['P'] + 0.3*df['K']
df['n_p_ratio'] = df['N'] / (df['P'] + 1)
df['n_k_ratio'] = df['N'] / (df['K'] + 1)
df['p_k_ratio'] = df['P'] / (df['K'] + 1)
df['water_index'] = df['rainfall'] * df['humidity']
df['gdd_approx'] = df['temp'] - 10
df['season_rabi'] = 1

crop_labels = ['groundnut','maize','mustard','pea','pearl millet','potato','rice']

def assign_crop(row):
    if row['rainfall'] > 150 and row['temp'] > 25: return 'rice'
    elif row['temp'] > 30 and row['humidity'] < 50: return 'groundnut'
    elif row['ph'] < 6.5 and row['N'] > 200: return 'maize'
    elif row['temp'] < 20: return 'pea'
    elif row['K'] > 200: return 'potato'
    elif row['P'] > 30: return 'mustard'
    else: return 'pearl millet'

df['crop'] = df.apply(assign_crop, axis=1)

X = df[['N','P','K','temp','humidity','ph','rainfall','npk_total','soil_fertility','n_p_ratio','n_k_ratio','p_k_ratio','water_index','gdd_approx','season_rabi']]
y = df['crop']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
joblib.dump(model, "models/season_model.pkl")
print("✅ season_model.pkl saved")

# Soil health model
X_soil = df[['N','P','K','ph','humidity','rainfall','temp']].copy()
X_soil['EC'] = np.random.uniform(0.1, 2.0, n)
X_soil['OC'] = np.random.uniform(0.3, 3.0, n)
X_soil['S'] = np.random.uniform(5, 50, n)
X_soil['Fe'] = np.random.uniform(2, 20, n)
X_soil['Zn'] = np.random.uniform(0.5, 5, n)
X_soil['Mn'] = np.random.uniform(1, 15, n)
X_soil['Cu'] = np.random.uniform(0.1, 3, n)
y_shi = np.random.uniform(20, 100, n)

from sklearn.ensemble import RandomForestRegressor
soil_model = RandomForestRegressor(n_estimators=100, random_state=42)
soil_cols = ['N','P','K','EC','OC','ph','S','Fe','Zn','Mn','Cu']
X_soil2 = X_soil[soil_cols]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_soil2)
soil_model.fit(X_scaled, y_shi)
joblib.dump(soil_model, "models/soil_health_model.pkl")
joblib.dump(scaler, "models/soil_scaler.pkl")
print("✅ soil_health_model.pkl saved")
print("✅ soil_scaler.pkl saved")

# Nutrient deficiency model
from sklearn.multioutput import MultiOutputClassifier
nutrients = ['N','P','K','S','Fe','Zn','Mn','Cu']
y_def = pd.DataFrame({
    'N': np.where(df['N'] < 150, 'Low', 'Normal'),
    'P': np.where(df['P'] < 15, 'Low', 'Normal'),
    'K': np.where(df['K'] < 100, 'Low', 'Normal'),
    'S': np.where(np.random.uniform(5,50,n) < 15, 'Low', 'Normal'),
    'Fe': np.where(np.random.uniform(2,20,n) < 5, 'Low', 'Normal'),
    'Zn': np.where(np.random.uniform(0.5,5,n) < 1.5, 'Low', 'Normal'),
    'Mn': np.where(np.random.uniform(1,15,n) < 4, 'Low', 'Normal'),
    'Cu': np.where(np.random.uniform(0.1,3,n) < 0.8, 'Low', 'Normal'),
})
nutrient_model = MultiOutputClassifier(RandomForestClassifier(n_estimators=50, random_state=42))
nutrient_model.fit(X_soil[['N','P','K','ph','humidity','rainfall','temp','EC','OC','S','Fe']], y_def)
joblib.dump(nutrient_model, "models/nutrient_deficiency_model.pkl")
print("✅ nutrient_deficiency_model.pkl saved")
print("\n🎉 All models ready! Now run: python3 app.py")
