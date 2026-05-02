import streamlit as st
import joblib
import numpy as np
import pandas as pd
import sqlite3
import matplotlib.pyplot as plt
import seaborn as sns

# -----------------------------
# to load the model
# -----------------------------
model = joblib.load("models/churn_model.pkl")

# -----------------------------
# for dataset
# -----------------------------
conn = sqlite3.connect("database/bank_churn.db")
df = pd.read_sql("SELECT * FROM customers", conn)
conn.close()

# -----------------------------
# PAGE TITLE
# -----------------------------
st.set_page_config(page_title="Bank Churn Prediction", layout="wide")

st.title("🏦 AI-Powered Bank Customer Churn Prediction & Retention System")
st.markdown("### Predict customer churn, analyze trends, and improve retention strategies")

# -----------------------------
# SIDEBAR INPUTS
# -----------------------------
st.sidebar.header("Enter Customer Details")

credit_score = st.sidebar.number_input(
    "Credit Score", min_value=300, max_value=900, value=600
)

geography = st.sidebar.selectbox(
    "Geography", ["France", "Germany", "Spain"]
)

gender = st.sidebar.selectbox(
    "Gender", ["Female", "Male"]
)

age = st.sidebar.number_input(
    "Age", min_value=18, max_value=100, value=35
)

tenure = st.sidebar.number_input(
    "Tenure (Years with Bank)", min_value=0, max_value=10, value=5
)

balance = st.sidebar.number_input(
    "Balance", min_value=0.0, value=50000.0
)

num_products = st.sidebar.number_input(
    "Number of Products", min_value=1, max_value=4, value=1
)

has_card = st.sidebar.selectbox(
    "Has Credit Card", [0, 1]
)

is_active = st.sidebar.selectbox(
    "Is Active Member", [0, 1]
)

salary = st.sidebar.number_input(
    "Estimated Salary", min_value=0.0, value=50000.0
)

# -----------------------------
# ENCODING
# -----------------------------
geo_map = {"France": 0, "Germany": 1, "Spain": 2}
gender_map = {"Female": 0, "Male": 1}

input_data = np.array([[
    credit_score,
    geo_map[geography],
    gender_map[gender],
    age,
    tenure,
    balance,
    num_products,
    has_card,
    is_active,
    salary
]])

# -----------------------------
# PREDICTION SECTION
# -----------------------------
st.subheader("🔍 Churn Prediction")

if st.button("Predict Churn"):

    prediction = model.predict(input_data)
    probability = model.predict_proba(input_data)[0][1]

    st.metric("Churn Probability", f"{probability * 100:.2f}%")

    if probability < 0.3:
        risk = "Low Risk"
        st.success("✅ Customer is likely to stay.")
    elif probability < 0.7:
        risk = "Medium Risk"
        st.warning("⚠ Customer may churn.")
    else:
        risk = "High Risk"
        st.error("🚨 Customer is highly likely to churn.")

    st.write(f"### Risk Category: {risk}")

    # Retention Recommendations
    st.subheader("💡 Recommended Retention Strategies")

    if probability >= 0.7:
        st.write("- Offer personalized loan discounts")
        st.write("- Provide premium relationship manager")
        st.write("- Introduce cashback rewards")
        st.write("- Offer loyalty bonuses")

    elif probability >= 0.3:
        st.write("- Provide targeted offers")
        st.write("- Encourage digital banking engagement")
        st.write("- Offer savings plans")

    else:
        st.write("- Maintain customer satisfaction")
        st.write("- Offer occasional loyalty rewards")

# -----------------------------
# CHARTS SECTION
# -----------------------------
st.subheader("📊 Customer Behavior Analytics")

col1, col2 = st.columns(2)

# Churn Distribution Pie Chart
with col1:
    st.markdown("### Churn Distribution")
    fig1, ax1 = plt.subplots()
    df["Exited"].value_counts().plot(
        kind="pie",
        autopct="%1.1f%%",
        labels=["Stayed", "Churned"],
        ax=ax1
    )
    ax1.set_ylabel("")
    st.pyplot(fig1)

# Geography vs Churn
with col2:
    st.markdown("### Geography vs Churn")
    fig2, ax2 = plt.subplots()
    sns.countplot(data=df, x="Geography", hue="Exited", ax=ax2)
    st.pyplot(fig2)

# Age Distribution
st.markdown("### Age Distribution by Churn")
fig3, ax3 = plt.subplots()
sns.histplot(data=df, x="Age", hue="Exited", bins=30, kde=True, ax=ax3)
st.pyplot(fig3)

# Balance vs Churn
st.markdown("### Balance vs Churn")
fig4, ax4 = plt.subplots()
sns.boxplot(data=df, x="Exited", y="Balance", ax=ax4)
st.pyplot(fig4)

# Active Member Status
st.markdown("### Active Membership vs Churn")
fig5, ax5 = plt.subplots()
sns.countplot(data=df, x="IsActiveMember", hue="Exited", ax=ax5)
st.pyplot(fig5)

# -----------------------------
# FOOTER
# -----------------------------
st.markdown("---")
st.markdown("### 🏆 Hackathon Project: AI-Powered Bank Customer Churn Prediction & Retention System")
st.markdown("Built with Python, SQLite, Random Forest, Streamlit, and Data Analytics")