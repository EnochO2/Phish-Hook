import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load the new phishing dataset
new_phishing_data_path = 'C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/data/Phishing_Legitimate_full.csv'
new_phishing_df = pd.read_csv(new_phishing_data_path)

# Verify the structure of the dataset
print("Column names and data types:")
print(new_phishing_df.info())

# Display the first few rows
print("\nFirst few rows of the dataset:")
print(new_phishing_df.head())

# Separate features and labels
if 'CLASS_LABEL' not in new_phishing_df.columns:
    print("Error: 'CLASS_LABEL' column not found in the dataset.")
else:
    X = new_phishing_df.drop(columns=['CLASS_LABEL'])
    y = new_phishing_df['CLASS_LABEL']

    # Ensure features are correctly formatted
    if not isinstance(X, pd.DataFrame) or not isinstance(y, pd.Series):
        print("Error: Incorrect feature or label format.")
    else:
        # Train-Test Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        print(f"Train-test split completed. Train shape: {X_train.shape}, Test shape: {X_test.shape}")

        # Model Training - Logistic Regression
        model = LogisticRegression(max_iter=1000)
        model.fit(X_train, y_train)
        print("Model training completed.")

        # Define save paths
        save_directory = 'C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/src/phishing-detector-extension'
        model_path = os.path.join(save_directory, 'model2.0.pkl')
        vectorizer_path = os.path.join(save_directory, 'vectorizer2.0.pkl')

        # Save the model
        joblib.dump(model, model_path)
        print(f"Model saved as model2.0 in {save_directory}")

        # Predictions
        y_pred = model.predict(X_test)
        print("Predictions completed.")

        # Evaluation
        print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
        print(f"Classification Report:\n{classification_report(y_test, y_pred)}")
