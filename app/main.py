from fastapi import FastAPI
from pydantic import BaseModel, Field
import pandas as pd
import joblib
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COLUMNS = [
    "latitude",
    "longitude",
    "price",
    "minimum_nights",
    "number_of_reviews",
    "reviews_per_month",
    "calculated_host_listings_count",
    "availability_365",
    "neighbourhood_group",
    "neighbourhood"
]
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "Model_Pipeline.pkl"

model = joblib.load(MODEL_PATH)


class Features(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    price: float = Field(..., ge=0)
    minimum_nights: int = Field(..., ge=1, le=365)
    number_of_reviews: int = Field(..., ge=0)
    reviews_per_month: float = Field(..., ge=0)
    calculated_host_listings_count: int = Field(..., ge=0)
    availability_365: int = Field(..., ge=0, le=365)
    neighbourhood_group: str = Field(..., min_length=1)
    neighbourhood: str = Field(..., min_length=1)


@app.get("/")
def check():
    return {"message": "API is working"}


@app.post("/predict")
def predict(features: Features):
    data = features.model_dump()
    row = pd.DataFrame([data], columns=COLUMNS)

    prediction = model.predict(row)
    probability = model.predict_proba(row)

    return {
        "Predicted_room_type": prediction[0],
        "probability": probability[0].tolist()
    }