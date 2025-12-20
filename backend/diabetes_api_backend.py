from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# fastapi
app = FastAPI(
    title="Diabetes Prediction API",
    description="Backend ML – Random Forest",
    version="1.0"
)

# load & train model
data = pd.read_csv("diabetes.csv")

X = data.drop("Outcome", axis=1)
y = data["Outcome"]

X_train, _, y_train, _ = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)

# description dictionary
FEATURE_INFO = {
    "Pregnancies": {"name": "Liczba ciąż", "min": 0, "max": 15},
    "Glucose": {"name": "Poziom glukozy na czczo (mg/dL)", "min": 70, "max": 99},
    "BloodPressure": {"name": "Ciśnienie rozkurczowe (mmHg)", "min": 60, "max": 80},
    "SkinThickness": {"name": "Grubość fałdu skórnego (mm)", "min": 10, "max": 30},
    "Insulin": {"name": "Poziom insuliny (µU/mL)", "min": 2, "max": 25},
    "BMI": {"name": "BMI", "min": 18.5, "max": 24.9},
    "DiabetesPedigreeFunction": {
        "name": "Wskaźnik predyspozycji genetycznych",
        "min": 0.0,
        "max": 0.8
    },
    "Age": {"name": "Wiek", "min": 0, "max": 120}
}

# input data model
class PatientData(BaseModel):
    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

# medical report generation
def generate_medical_report(patient_dict):
    report = []

    for key, value in patient_dict.items():
        info = FEATURE_INFO[key]
        if value < info["min"]:
            report.append(
                f"{info['name']} jest ZA NISKA ({value}) – norma: {info['min']}–{info['max']}"
            )
        elif value > info["max"]:
            report.append(
                f"{info['name']} jest ZA WYSOKA ({value}) – norma: {info['min']}–{info['max']}"
            )

    if not report:
        report.append("Wszystkie parametry mieszczą się w zakresie norm.")

    return report

# endpoint
@app.post("/predict")
def predict(data: PatientData):
    patient_dict = data.dict()
    patient_df = pd.DataFrame([patient_dict])

    probability = model.predict_proba(patient_df)[0][1] * 100

    return {
        "prawdopodobienstwo_cukrzycy": round(probability, 2),
        "interpretacja": (
            "WYSOKIE RYZYKO" if probability >= 70 else
            "UMIARKOWANE RYZYKO" if probability >= 40 else
            "NISKIE RYZYKO"
        ),
        "raport": generate_medical_report(patient_dict)
    }

# health check
@app.get("/")
def root():
    return {"status": "API działa"}

#/docs -> /predict