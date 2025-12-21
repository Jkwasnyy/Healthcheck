from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from fastapi.middleware.cors import CORSMiddleware

# fastapi
app = FastAPI(
    title="Diabetes Prediction API",
    description="Backend ML – Random Forest",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
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
    "Pregnancies": {"name": "Number of Pregnancies", "min": 0, "max": 15},
    "Glucose": {"name": "Fasting Glucose (mg/dL)", "min": 70, "max": 99},
    "BloodPressure": {"name": "Diastolic Blood Pressure (mmHg)", "min": 60, "max": 80},
    "SkinThickness": {"name": "Skin Fold Thickness (mm)", "min": 10, "max": 30},
    "Insulin": {"name": "Insulin Level (µU/mL)", "min": 2, "max": 25},
    "BMI": {"name": "Body Mass Index (BMI)", "min": 18.5, "max": 24.9},
    "DiabetesPedigreeFunction": {
        "name": "Diabetes Pedigree Function",
        "min": 0.0,
        "max": 0.8
    },
    "Age": {"name": "Age (years)", "min": 0, "max": 120}
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
                f"{info['name']} IS TO LOW ({value}) – NORM: {info['min']}–{info['max']}"
            )
        elif value > info["max"]:
            report.append(
                f"{info['name']} IS TO HIGH ({value}) – NORM: {info['min']}–{info['max']}"
            )

    if not report:
        report.append("All parameters are within the norm.")

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
            "HIGH RISK" if probability >= 70 else
            "MODERATE RISK" if probability >= 40 else
            "LOW RISK"
        ),
        "raport": generate_medical_report(patient_dict)
    }

# health check
@app.get("/")
def root():
    return {"status": "API działa"}

#/docs -> /predict