import pandas as pd
import sqlite3
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Connect database
conn = sqlite3.connect("database/bank_churn.db")

# Load customer table
df = pd.read_sql("SELECT * FROM customers", conn)

# Close connection
conn.close()

# Drop unnecessary columns
drop_cols = ["CustomerId", "Surname"]
df = df.drop(columns=[col for col in drop_cols if col in df.columns])

# Encode categorical columns
for col in ["Geography", "Gender"]:
    if col in df.columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])

# Features and target
X = df.drop("Exited", axis=1)
y = df["Exited"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Random Forest model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)
print("Model Accuracy:", accuracy)

# Save model
joblib.dump(model, "models/churn_model.pkl")

print("Model saved successfully!")