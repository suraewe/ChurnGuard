import pandas as pd
import sqlite3

# Load CSV dataset
df = pd.read_csv("data/Bank_Churn.csv")

# Show preview
print("First 5 Rows:")
print(df.head())

# Show column names
print("\nColumns:")
print(df.columns)

# Connect to SQLite database
conn = sqlite3.connect("database/bank_churn.db")

# Store data in SQL table
df.to_sql("customers", conn, if_exists="replace", index=False)

print("\nDatabase created successfully!")

# Close connection
conn.close()