# 🏠 NYC Airbnb Room Type Predictor

A machine learning web application that predicts the most likely **Airbnb room type** from listing information such as location, price, reviews, availability, and neighborhood.

The project uses a **Scikit-learn Random Forest classification pipeline**, served through **FastAPI**, with a responsive HTML/CSS/JavaScript frontend.

## 🚀 Live Demo

**Frontend:**  
https://airbnb-room-type-predictor.vercel.app/

**Backend API:**  
https://airbnb-room-type-predictor-bvjh.onrender.com/

## ✨ Features

- 🤖 Machine Learning powered room-type prediction
- 🌲 Random Forest classification
- 📊 Prediction probabilities and confidence
- 📍 Location-based prediction
- 🏙️ NYC borough and neighborhood selection
- ⚡ FastAPI REST API
- 🔴 Real-time API status
- 📱 Responsive UI
- ✅ Input validation with Pydantic

## 🧠 Prediction Classes

- Entire home/apt
- Private room
- Shared room
- Hotel room


## 📋 Input Features

The model uses **10 features**:

| Feature | Description |
|---|---|
| `latitude` | Listing latitude |
| `longitude` | Listing longitude |
| `price` | Price per night |
| `minimum_nights` | Minimum required nights |
| `number_of_reviews` | Total number of reviews |
| `reviews_per_month` | Average reviews per month |
| `calculated_host_listings_count` | Host's listing count |
| `availability_365` | Available days per year |
| `neighbourhood_group` | NYC borough |
| `neighbourhood` | NYC neighborhood |

## 🛠️ Tech Stack

**Machine Learning**
- Python
- Pandas
- Scikit-learn
- Joblib
- Random Forest

**Backend**
- FastAPI
- Pydantic
- Uvicorn
- CORS

**Frontend**
- HTML
- CSS
- JavaScript

**Deployment**
- Vercel
- Render


---

## Model Comparison

| Model | Accuracy | Macro F1 |
|---|---:|---:|
| Logistic Regression | 65.9% | 52.2% |
| Decision Tree | 78.2% | 64.7% |
| **Random Forest** | **85.1%** | **71.5%** |
| Gradient Boosting | 85.0% | 70.5% |

Random Forest achieved the best overall performance among the evaluated models and was selected for further optimization.


## 🔧 Hyperparameter Tuning

Hyperparameter tuning was performed on the Random Forest model using cross-validation with **Macro F1** as the optimization metric.

### Best Parameters

```text
n_estimators = 200
min_samples_split = 10
max_depth = None
```


## 🔌 API

### Health Check

```http
GET /
```

```json
{
  "message": "API is working"
}
```

### Prediction

```http
POST /predict
```

Example request:

```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "price": 150,
  "minimum_nights": 2,
  "number_of_reviews": 45,
  "reviews_per_month": 2.5,
  "calculated_host_listings_count": 3,
  "availability_365": 180,
  "neighbourhood_group": "Manhattan",
  "neighbourhood": "Midtown"
}
```

Example response:

```json
{
  "Predicted_room_type": "Entire home/apt",
  "probability": [
    0.69,
    0.28,
    0.02,
    0.01
  ]
}
```

## 📁 Project Structure

```text
airbnb-room-type-predictor/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── main.py
|   ├──  __init__.py
│   ├── Model_Pipeline.pkl
│   
|── requirements.txt
└── README.md
```

## ⚙️ Run Locally

### Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

### Frontend

Update the API URL in `script.js`:

```javascript
const API_URL = "http://127.0.0.1:8000";
```

Then open `frontend/index.html` in your browser.

## 🔄 How It Works

```text
Listing Information
        ↓
Frontend Validation
        ↓
FastAPI /predict
        ↓
Pydantic Validation
        ↓
ML Pipeline
        ↓
Random Forest
        ↓
Room Type + Probabilities
        ↓
Prediction Result
```

## 👨‍💻 Project

**NYC StayAI — Airbnb Room Type Predictor**

Built with **Scikit-learn, FastAPI, HTML, CSS and JavaScript**.
