from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, Field, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
import jwt
from fastapi import Body
 
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
 
from database import (
    register_patient, login_patient, save_health_result, 
    get_patient_results, get_patient_info
)
 
# FASTAPI SETUP
app = FastAPI(
    title="Diabetes Prediction API",
    description="Backend ML - Random Forest",
    version="1.0"
)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
 
# JWT SETTINGS
SECRET_KEY = "secretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12  # 12 hours
 
 
# AUTHENTICATION UTILITIES
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        user_id = payload.get("patient_id")
        if not user_id:
            raise HTTPException(status_code=401)
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
 
def create_jwt(patient_id: int):
    payload = {
        "patient_id": patient_id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
 
 
def decode_jwt(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
 
 
# ML MODEL SETUP
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
 
# DISEASE NORMS
DISEASE_NORMS = {
    "Diabetes": ["Glucose"],
    "Obesity": ["BMI", "SkinThickness"],
    "Hypertension": ["BloodPressure", "BMI"],
    "Metabolic Syndrome": ["Glucose", "Insulin", "BMI"]
}
 
# MEDICAL LOGIC
FEATURE_INFO = {
    "Pregnancies": {"name": "Number of Pregnancies", "min": 0, "max": 15},
    "Glucose": {"name": "Fasting Glucose (mg/dL)", "min": 70, "max": 99, "warning": 126, "critical": 200},
    "BloodPressure": {"name": "Diastolic Blood Pressure (mmHg)", "min": 60, "max": 80, "warning": 90, "critical": 120},
    "SkinThickness": {"name": "Skin Fold Thickness (mm)", "min": 10, "max": 30},
    "Insulin": {"name": "Insulin Level (µU/mL)", "min": 2, "max": 25, "warning": 100},
    "BMI": {"name": "Body Mass Index", "min": 18.5, "max": 24.9, "warning": 30, "critical": 35},
    "DiabetesPedigreeFunction": {"name": "Diabetes Pedigree Function","min": 0.0,"max": 0.8},
    "Age": {"name": "Age (years)", "min": 0, "max": 120}
}
 
# MEDICAL UI ADVICE
MEDICAL_UI_ADVICE = {
    "Diabetes": {
        "small": {
            "title": "Low diabetes risk",
            "how_to_cure": "Maintaining a healthy lifestyle helps prevent future risk. Eat balanced meals (low sugar, high fiber). Exercise at least 30 min/day. Avoid sugary drinks. Keep weight under control. ",
            "warning": "Still monitor your diet and lifestyle to prevent future risk.",
            "movies": ["https://www.youtube.com/watch?v=rMMpeLLgdgY"]
            },
        "medium": {
            "title": "Moderate diabetes risk", 
            "how_to_cure": "Monitor glucose levels and reduce sugar intake. Check fasting glucose regularly. Reduce refined carbs and sugar, Increase physical activity, Consider medical check-up",
            "warning": "If symptoms appear, consult a doctor.",
            "movies": ["https://www.youtube.com/watch?v=rMMpeLLgdgY"]
            },
        "high": {
            "title": "High diabetes risk", 
            "how_to_cure": "Medical consultation is strongly recommended. Schedule medical check-up. Monitor blood glucose daily. Start a structured diet plan. Consider medication if prescribed.",
            "warning": "Do not ignore symptoms like excessive thirst, frequent urination, or fatigue.",
            "movies": ["https://www.youtube.com/watch?v=rMMpeLLgdgY"],
            }
    },
    "Obesity": {
        "small": {
            "title": "Normal weight",
            "how_to_cure": "Maintain healthy lifestyle to prevent weight gain. Keep balanced diet. Exercise regularly. Avoid overeating. Track weight monthly.",
            "warning": "Avoid quick weight gain; monitor BMI.",
            "movies": ["https://www.youtube.com/watch?v=VgL8bIlbklQ"]
            },
        "medium": {
            "title": "Obesity detected", 
            "how_to_cure": "Lifestyle changes can significantly improve health. Reduce calorie intake. Increase physical activity. Avoid processed foods. Consider professional dietician support",
            "warning": "Obesity increases risk of diabetes, hypertension, and heart disease.",
            "movies": ["https://www.youtube.com/watch?v=VgL8bIlbklQ"]
            },
        "high": {
            "title": "Severe obesity", 
            "how_to_cure": "Professional medical consultation is advised. Consider structured weight loss program. Check for metabolic syndrome",
            "warning": "Severe obesity is associated with high risk of complications.",
            "movies": ["https://www.youtube.com/watch?v=VgL8bIlbklQ"]
            }
    },
    "Hypertension": {
        "small": {
            "title": "Normal blood pressure",
            "how_to_cure": "Reduce salt intake. Exercise regularly. Maintain healthy weight. Limit alcohol consumption.",
            "warning": "Monitor blood pressure periodically.",
            "movies": ["https://www.youtube.com/watch?v=rI-ktNcbi7M"]
        },
        "medium": {
            "title": "Elevated blood pressure", 
            "how_to_cure": "Reduce salt intake and manage stress. Increase physical activity. Monitor blood pressure regularly",
            "warning": "If blood pressure remains high, consult a doctor.",
            "movies": ["https://www.youtube.com/watch?v=rI-ktNcbi7M"]
            },
        "high": {
            "title": "High blood pressure", 
            "how_to_cure": "Medical evaluation is recommended. Avoid alcohol and smoking. Monitor blood pressure daily. Follow prescribed treatment plan.",
            "warning": "High BP increases risk of heart attack and stroke.",
            "movies": ["https://www.youtube.com/watch?v=rI-ktNcbi7M"]
            }
    },
    "Metabolic Syndrome": {
        "small": {
            "title": "Low metabolic risk",
            "how_to_cure": "Balanced diet. Regular exercise. Avoid sugary drinks. Maintain normal weight",
            "warning": "Monitor your health periodically.",
            "movies": ["https://www.youtube.com/watch?v=J-o6tRZ2n8o"]
        },
        "medium": {
            "title": "Metabolic risk detected", 
            "how_to_cure": "Lifestyle modification is recommended. Reduce sugar and refined carbs. Maintain healthy weight. Consider medical consultation.",
            "warning": "Metabolic syndrome increases risk of diabetes and cardiovascular disease.",
            "movies": ["https://www.youtube.com/watch?v=J-o6tRZ2n8o"]
            },
        "high": {
            "title": "High metabolic risk", 
            "how_to_cure": "Consult a healthcare professional. Check blood glucose and lipid profile. Follow structured diet and exercise plan.",
            "warning": "High metabolic risk increases chances of diabetes and heart disease.",
            "movies": ["https://www.youtube.com/watch?v=J-o6tRZ2n8o"]
            }
    }
}
 
# MODELS
class PatientData(BaseModel):
    Pregnancies: int = Field(ge=0, le=20)
    Glucose: float = Field(ge=40, le=500)
    BloodPressure: float = Field(ge=30, le=200)
    SkinThickness: float = Field(ge=0, le=100)
    Insulin: float = Field(ge=0, le=1000)
    BMI: float = Field(ge=10, le=70)
    DiabetesPedigreeFunction: float = Field(ge=0, le=5)
    Age: int = Field(ge=1, le=120)
 
 
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
 
 
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
 
 
 
class SaveResultRequest(BaseModel):
    patient_id: int
    diabetes: dict
    diseases_detected: dict
    raport: list
 
def get_norms_for_disease(disease_name, norms):
    params = DISEASE_NORMS.get(disease_name, [])
    return {p: norms[p] for p in params}
 
def get_norms():
    norms = {}
    for k, v in FEATURE_INFO.items():
        norms[k] = f"{v['min']} - {v['max']}"
    return norms
 
def analyze_health(patient_dict):
    diseases = {}
 
    glucose = patient_dict["Glucose"]
    insulin = patient_dict["Insulin"]
    bmi = patient_dict["BMI"]
    age = patient_dict["Age"]
    bp = patient_dict["BloodPressure"]
    skin = patient_dict["SkinThickness"]
 
    # OBESITY
    diseases["Obesity"] = {
        "risk_level": "high" if bmi >= 35 else "medium" if bmi >= 30 else "small"
    }
 
    # HYPERTENSION
    diseases["Hypertension"] = {
        "risk_level": "high" if bp > 120 else "medium" if bp > 90 else "small"
    }
 
    # METABOLIC SYNDROME
    metabolic_flags = 0
    if glucose > 100:
        metabolic_flags += 1
    if insulin > 100:
        metabolic_flags += 1
    if bmi > 30:
        metabolic_flags += 1
 
    diseases["Metabolic Syndrome"] = {
        "risk_level": "high" if metabolic_flags >= 3 else "medium" if metabolic_flags >= 2 else "small"
    }
 
    return diseases
 
def build_frontend_report(diseases, diabetes_risk, norms):
    result = []
 
    # diabetes
    diab = MEDICAL_UI_ADVICE["Diabetes"][diabetes_risk]
    result.append({
        "diabetes": {
            "result": diab["title"],
            "medical_advices": diab["warning"],
            "how_to_cure": diab["how_to_cure"],
            "movies": diab["movies"],
            "norm": get_norms_for_disease("Diabetes", norms)
        }
    })
 
    # other diseases
    for name, info in diseases.items():
        risk = info["risk_level"]
        advice = MEDICAL_UI_ADVICE[name][risk]
 
        result.append({
            name: {
                "result": advice["title"],
                "medical_advices": advice["warning"],
                "how_to_cure": advice["how_to_cure"],
                "movies": advice["movies"],
                "norm": get_norms_for_disease(name, norms)
            }
        })
 
    return result
 
# MEDICAL REPORT GENERATION
def generate_medical_report(patient_dict):
    report = []
    for key, value in patient_dict.items():
        info = FEATURE_INFO[key]
        if value < info["min"]:
            report.append(f"{info['name']} IS TOO LOW ({value}) – NORM: {info['min']}–{info['max']}")
        elif value > info["max"]:
            report.append(f"{info['name']} IS TOO HIGH ({value}) – NORM: {info['min']}–{info['max']}")
 
    if not report:
        report.append("All parameters are within the norm.")
 
    return report
 
# ENDPOINTS
@app.post("/predict")
def predict(data: PatientData):
    patient_dict = data.dict()
    patient_df = pd.DataFrame([patient_dict])
 
    probability = model.predict_proba(patient_df)[0][1] * 100
 
    if probability >= 70:
        risk_label = "high"
    elif probability >= 40:
        risk_label = "medium"
    else:
        risk_label = "small"
 
    diseases_analysis = analyze_health(patient_dict)
    norms = get_norms()
 
    return {
        "diabetes": {
            "risk_level": risk_label,
            "probability": round(probability, 1),
            "description": "Type 2 Diabetes Mellitus"
        },
        "diseases_detected": diseases_analysis,
        "raport": generate_medical_report(patient_dict),
        "ui_advice": build_frontend_report(diseases_analysis, risk_label, norms)
    }
 
@app.post("/register")
def register(data: RegisterRequest):
    result = register_patient(
        data.email,
        data.password,
        data.first_name,
        data.last_name,
    )
    return result
 
 
 
@app.post("/login")
def login(data: OAuth2PasswordRequestForm = Depends()):
    login_res = login_patient(data.username, data.password)
 
    if login_res["status"] != "ok":
        raise HTTPException(status_code=401, detail=login_res["message"])
 
    token = create_jwt(login_res["patient_id"])
 
    return {
        "access_token": token,
        "token_type": "bearer",
        "patient_id": login_res["patient_id"]
    }
 
 
 
@app.get("/patient/{patient_id}")
def get_patient(patient_id: int, user_id=Depends(get_current_user)):
    if patient_id != user_id:
        raise HTTPException(status_code=403)
    return get_patient_info(patient_id)
 
 
 
@app.post("/save-result")
def save_result(data: SaveResultRequest, user_id: int = Depends(get_current_user)):
    if data.patient_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
 
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
def get_results(patient_id: int, user_id: int = Depends(get_current_user)):
    if patient_id != user_id:
        raise HTTPException(status_code=403)
 
    results = get_patient_results(patient_id) or []
    norms = get_norms()
 
    enriched_results = []
    for r in results:
        result_data = r.get("result", {})
        diabetes = result_data.get("diabetes", {})
        diseases = result_data.get("diseases_detected", {})
 
        ui_advice = []
 
        diabetes_risk = diabetes.get("risk_level")
        if diabetes_risk:
            diab = MEDICAL_UI_ADVICE["Diabetes"][diabetes_risk]
            ui_advice.append({
                "diabetes": {
                    "result": diab["title"],
                    "medical_advices": diab["warning"],
                    "how_to_cure": diab["how_to_cure"],
                    "movies": diab["movies"],
                    "norm": get_norms_for_disease("Diabetes", norms)
                }
            })
 
        for d, info in diseases.items():
            risk = info.get("risk_level")
            if risk:
                advice = MEDICAL_UI_ADVICE[d][risk]
                ui_advice.append({
                    d: {
                        "result": advice["title"],
                        "medical_advices": advice["warning"],
                        "how_to_cure": advice["how_to_cure"],
                        "movies": advice["movies"],
                        "norm": get_norms_for_disease(d, norms)
                    }
                })
 
        enriched_results.append({
            **r,
            "ui_advice": ui_advice,
            "disclaimer": "Educational information only. Not a medical diagnosis."
        })
 
    return enriched_results

@app.get("/me")
def get_me(user_id: int = Depends(get_current_user)):
    """
    Zwraca dane zalogowanego pacjenta.
    user_id pochodzi z tokena JWT.
    """
    info = get_patient_info(user_id)
    if info.get("status") == "error":
        raise HTTPException(status_code=404, detail="User not found")
    return info

@app.post("/login-json")
def login_json(data: LoginRequest = Body(...)):
    login_res = login_patient(data.email, data.password)
    
    if login_res["status"] != "ok":
        raise HTTPException(status_code=401, detail=login_res["message"])
    
    token = create_jwt(login_res["patient_id"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "patient_id": login_res["patient_id"]
}
 
@app.get("/")
def root():
    return {"status": "API działa"}
 
#/docs -> /predict