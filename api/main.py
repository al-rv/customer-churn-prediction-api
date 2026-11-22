from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from pathlib import Path
import pandas as pd
from typing import Literal
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "churn_model.joblib"

model = joblib.load(MODEL_PATH)

THRESHOLD = 0.30


#define schema of input data
class CustomerData(BaseModel):
    gender: Literal["Female", "Male"]
    SeniorCitizen: Literal[0, 1]
    Partner: Literal["Yes", "No"]
    Dependents: Literal["Yes", "No"]

    tenure: int = Field(ge=0)

    PhoneService: Literal["Yes", "No"]
    MultipleLines: Literal["Yes", "No", "No phone service"]

    InternetService: Literal["DSL", "Fiber optic", "No"]

    OnlineSecurity: Literal["Yes", "No", "No internet service"]
    OnlineBackup: Literal["Yes", "No", "No internet service"]
    DeviceProtection: Literal["Yes", "No", "No internet service"]
    TechSupport: Literal["Yes", "No", "No internet service"]
    StreamingTV: Literal["Yes", "No", "No internet service"]
    StreamingMovies: Literal["Yes", "No", "No internet service"]

    Contract: Literal[
        "Month-to-month",
        "One year",
        "Two year"
    ]

    PaperlessBilling: Literal["Yes", "No"]

    PaymentMethod: Literal[
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)"
    ]

    MonthlyCharges: float = Field(ge=0)
    TotalCharges: float = Field(ge=0)


class PredictionResponse(BaseModel):
    churn_probability: float
    prediction: Literal[0, 1]
    prediction_label: Literal["Churn", "Stay"]
    threshold: float




#create application
app = FastAPI(
    title="Customer Churn Prediction API"
)


#define endpoint
@app.get("/")
def home():
    return{
        "message": "Customer Churn Prediction API"
    }
    
    
@app.post("/predict",
          response_model=PredictionResponse)
def predict(customer: CustomerData):

    customer_df = pd.DataFrame(
        [customer.model_dump()]
    )

    churn_probability = model.predict_proba(
        customer_df
    )[0, 1]

    prediction = int(
        churn_probability >= THRESHOLD
    )

    return {
        "churn_probability": round(float(churn_probability), 4),
        "prediction": prediction,
        "prediction_label": "Churn" if prediction == 1 else "Stay",
        "threshold": THRESHOLD
    }