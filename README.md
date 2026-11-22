# Customer Churn Prediction

An end-to-end machine learning project that predicts telecom customer churn using **Logistic Regression** and serves predictions through a **FastAPI web application deployed on Vercel**.

**Live App:** https://customer-churn-prediction-api.vercel.app  
**API Docs:** https://customer-churn-prediction-api.vercel.app/docs

## Project Overview

The goal is to predict a customer's probability of churn so a business can identify at-risk customers for potential retention efforts.

The project covers the complete workflow:

**Data Cleaning → EDA → Preprocessing → Modeling → Cross-Validation → Threshold Selection → FastAPI → Deployment**

The dataset contains **7,043 telecom customers** with account, service, contract, and billing information.

## Key EDA Findings

- **Month-to-month** customers had a 42.7% churn rate, compared with 11.3% for one-year and 2.8% for two-year contracts.
- Churned customers had a median **tenure of 10 months**, compared with 38 months for customers who stayed.
- **Fiber optic** customers had the highest internet-service churn rate at 41.9%.
- Customers without **Tech Support** had a 41.6% churn rate versus 15.2% for customers with Tech Support.
- Senior customers had a higher observed churn rate: **41.7% vs. 23.6%** for non-seniors.

EDA also showed why aggregated statistics require care: churners had higher MonthlyCharges overall, but this relationship changed when customers were compared within internet-service groups.

## Modeling

The project uses a scikit-learn `Pipeline`:

```text
Customer Data
      ↓
ColumnTransformer
 ├─ Numerical → StandardScaler
 ├─ Categorical → OneHotEncoder
 └─ SeniorCitizen → Passthrough
      ↓
Logistic Regression
      ↓
Churn Probability
```

The data was split **80/20 using stratification**, and 5-fold stratified cross-validation was used during model development.

Because missing an actual churner was assumed to be more costly than contacting a customer who would have stayed, the classification threshold was reduced from the default `0.50` to **`0.30`** using cross-validation results.

## Final Test Results

| Metric | Score |
|---|---:|
| Precision | **51.9%** |
| Recall | **75.4%** |
| F1 Score | **61.5%** |

The model correctly identified **282 of 374 actual churners**, giving approximately **75% recall**.

## Deployment

The trained pipeline is saved with `joblib` and served through **FastAPI**.

The API:

- validates customer inputs using Pydantic,
- generates churn probabilities with `predict_proba()`,
- applies the 30% decision threshold,
- returns the probability and Churn/Stay prediction.

A lightweight **frontend** provides an interactive interface for the deployed model.

## Project Structure

```text
customer-churn/
├── api/
│   └── main.py
├── data/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── models/
│   └── churn_model.joblib
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   ├── 02_eda.ipynb
│   ├── 03_modeling.ipynb
│   └── 04_model_test.ipynb
├── pyproject.toml
├── uv.lock
└── README.md
```

## Tech Stack

**Data Science:** Python, Pandas, NumPy, scikit-learn, Matplotlib, Seaborn  
**ML:** Logistic Regression, preprocessing pipelines, cross-validation, threshold tuning  
**Backend:** FastAPI, Pydantic, Joblib, Uvicorn  
**Frontend:** HTML, CSS, JavaScript  
**Deployment:** Git, GitHub, Vercel, uv

## Skills Demonstrated

- Data cleaning and exploratory analysis
- Binary classification
- Feature preprocessing and encoding
- Prevention of data leakage
- Precision, recall, F1 and confusion matrices
- Stratified cross-validation
- Classification threshold selection
- Logistic Regression interpretation
- Model serialization
- End-to-end ML deployment


## Key Takeaway

This project demonstrates that model evaluation should reflect the **business objective**, not accuracy alone. By prioritizing recall and validating the operating threshold through cross-validation, the final model identifies approximately **three out of every four churners** while remaining interpretable and deployable.