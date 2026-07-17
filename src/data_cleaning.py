import pandas as pd

# ============================================================
# MetricMind - Data Cleaning Pipeline
# Day 3: Warehouse & Modeling
# ============================================================

# Load the raw dataset
df = pd.read_csv("data/raw/Global_Superstore.csv", encoding="latin1")

print("=" * 55)
print("RAW DATASET SUMMARY")
print("=" * 55)
print(f"Rows               : {df.shape[0]}")
print(f"Columns            : {df.shape[1]}")
print(f"Missing Values     : {df.isnull().sum().sum()}")
print(f"Duplicate Rows     : {df.duplicated().sum()}")

# Remove unnecessary helper column
df.drop(columns=["ji_lu-shu"], inplace=True)

# Standardize column names
df.columns = (
    df.columns
      .str.strip()                    # Remove leading/trailing spaces
      .str.upper()                    # Convert to uppercase
      .str.replace(" ", "_", regex=False)   # Replace spaces with underscores
      .str.replace("-", "_", regex=False)   # Replace hyphens with underscores
)

# Save cleaned dataset
output_path = "data/transformed/Global_Superstore_Cleaned.csv"
df.to_csv(output_path, index=False)

print("\n" + "=" * 55)
print("DATA CLEANING REPORT")
print("=" * 55)
print("Dropped Columns    : ji_lu-shu")
print(f"Rows               : {df.shape[0]}")
print(f"Columns            : {df.shape[1]}")
print(f"Missing Values     : {df.isnull().sum().sum()}")
print(f"Duplicate Rows     : {df.duplicated().sum()}")
print("Dataset Status     : READY FOR SNOWFLAKE")
print(f"Saved To           : {output_path}")
print("=" * 55)