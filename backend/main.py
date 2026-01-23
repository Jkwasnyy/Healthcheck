from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from fastapi.middleware.cors import CORSMiddleware
from database import (
    register_patient, login_patient, save_health_result, 
    get_patient_results, get_patient_info
)

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
    "Glucose": {"name": "Fasting Glucose (mg/dL)", "min": 70, "max": 99, "warning": 126, "critical": 200},
    "BloodPressure": {"name": "Diastolic Blood Pressure (mmHg)", "min": 60, "max": 80, "warning": 90, "critical": 120},
    "SkinThickness": {"name": "Skin Fold Thickness (mm)", "min": 10, "max": 30},
    "Insulin": {"name": "Insulin Level (µU/mL)", "min": 2, "max": 25, "warning": 100},
    "BMI": {"name": "Body Mass Index", "min": 18.5, "max": 24.9, "warning": 30, "critical": 35},
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


class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    age: int


class LoginRequest(BaseModel):
    email: str
    password: str


class SaveResultRequest(BaseModel):
    patient_id: int
    diabetes: dict
    diseases_detected: dict
    raport: list

# medical report generation
def generate_medical_report(patient_dict):
    report = []

    for key, value in patient_dict.items():
        info = FEATURE_INFO[key]
        if value < info["min"]:
            report.append(
                f"{info['name']} IS TOO LOW ({value}) – NORM: {info['min']}–{info['max']}"
            )
        elif value > info["max"]:
            report.append(
                f"{info['name']} IS TOO HIGH ({value}) – NORM: {info['min']}–{info['max']}"
            )

    if not report:
        report.append("All parameters are within the norm.")

    return report


# health analysis
def analyze_health(patient_dict):
    diseases = {}
    
    glucose = patient_dict["Glucose"]
    insulin = patient_dict["Insulin"]
    bmi = patient_dict["BMI"]
    age = patient_dict["Age"]
    bp = patient_dict["BloodPressure"]
    skin = patient_dict["SkinThickness"]
    
    # OTYŁOŚĆ/OBESITY
    obesity_flags = []
    if bmi >= 30:
        obesity_flags.append(f"BMI in obesity range ({bmi})")
    if skin > 30:
        obesity_flags.append(f"Elevated skin fold thickness ({skin}mm) - high body fat")
    
    diseases["Obesity"] = {
        "risk_level": "spore" if bmi >= 35 else "umiarkowane" if bmi >= 30 else "małe",
        "flags": obesity_flags,
        "description": "Overweight/Obesity"
    }
    
    # NADCIŚNIENIE/HYPERTENSION
    hypertension_flags = []
    if bp > 90:
        hypertension_flags.append(f"Elevated blood pressure ({bp} mmHg)")
    if bmi > 25:
        hypertension_flags.append("Overweight increases hypertension risk")
    if age > 50:
        hypertension_flags.append("Age increases hypertension risk")
    
    diseases["Hypertension"] = {
        "risk_level": "spore" if bp > 120 else "umiarkowane" if bp > 90 else "małe",
        "flags": hypertension_flags,
        "description": "High Blood Pressure"
    }
    
    # ZABURZENIA METABOLICZNE
    metabolic_flags = []
    if glucose > 100:
        metabolic_flags.append("Impaired fasting glucose")
    if insulin > 100:
        metabolic_flags.append("Elevated insulin - metabolic syndrome indicator")
    if bmi > 30:
        metabolic_flags.append("Obesity - component of metabolic syndrome")
    
    diseases["Metabolic Syndrome"] = {
        "risk_level": "spore" if len(metabolic_flags) >= 3 else "umiarkowane" if len(metabolic_flags) >= 2 else "małe",
        "flags": metabolic_flags,
        "description": "Cluster of metabolic disorders"
    }
    
    return diseases


# endpoint
@app.post("/predict")
def predict(data: PatientData):
    patient_dict = data.dict()
    patient_df = pd.DataFrame([patient_dict])

    # Get diabetes probability from model
    probability = model.predict_proba(patient_df)[0][1] * 100
    
    # Determine risk level with Polish label
    if probability >= 70:
        risk_label = "spore"
    elif probability >= 40:
        risk_label = "umiarkowane"
    else:
        risk_label = "małe"

    # Analyze all possible diseases
    diseases_analysis = analyze_health(patient_dict)
    
    # Filter diseases with at least one flag
    significant_diseases = {
        name: info for name, info in diseases_analysis.items() 
        if info["flags"]
    }

    return {
        "diabetes": {
            "risk_level": risk_label,
            "probability": round(probability, 1),
            "description": "Type 2 Diabetes Mellitus"
        },
        "diseases_detected": significant_diseases,
        "raport": generate_medical_report(patient_dict)
    }


# AUTHENTICATION ENDPOINTS

@app.post("/register")
def register(data: RegisterRequest):
    result = register_patient(
        data.email,
        data.password,
        data.first_name,
        data.last_name,
        data.age
    )
    return result


@app.post("/login")
def login(data: LoginRequest):
    result = login_patient(data.email, data.password)
    return result


@app.get("/patient/{patient_id}")
def get_patient(patient_id: int):
    result = get_patient_info(patient_id)
    return result


# RESULTS ENDPOINTS

@app.post("/save-result")
def save_result(data: SaveResultRequest):
    result = save_health_result(
        data.patient_id,
        {
            "diabetes": data.diabetes,
            "diseases_detected": data.diseases_detected,
            "raport": data.raport
        }
    )
    return result


@app.get("/patient/{patient_id}/results")
def get_results(patient_id: int):
    result = get_patient_results(patient_id)
    return result

# health check
@app.get("/")
def root():
    return {"status": "API działa"}

#/docs -> /predict