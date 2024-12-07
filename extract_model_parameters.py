import joblib
import json
import os

# Define paths
model_path = 'model3.0.pkl'
vectorizer_path = 'vectorizer3.0.pkl'
output_path = 'model_data.json'

# Check if .pkl files exist before loading
if not os.path.exists(model_path):
    print(f"Error: The model file {model_path} does not exist.")
    exit(1)

if not os.path.exists(vectorizer_path):
    print(f"Error: The vectorizer file {vectorizer_path} does not exist.")
    exit(1)

# Load your model and vectorizer
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

# Extract model parameters
model_data = {
    "weights": model.coef_[0].tolist(),
    "intercept": model.intercept_[0],
    "features": vectorizer.get_feature_names_out().tolist()
}

# Save model data to a JSON file
with open(output_path, 'w') as f:
    json.dump(model_data, f)

# Check if JSON file is created successfully
if os.path.exists(output_path):
    print(f"Success: Model data has been extracted to {output_path}.")
else:
    print(f"Error: Failed to create {output_path}.")