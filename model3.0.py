import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load legitimate emails
df_legitimate = pd.read_csv('C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/data/legitimate_emails.csv', encoding='utf-8')

# Assume a single column and handle any NaNs
if 'body' not in df_legitimate.columns:
    df_legitimate.columns = ['body']
df_legitimate['body'] = df_legitimate['body'].fillna('').astype(str)
df_legitimate['label'] = 'legitimate'

# Load phishing emails
df_phishing = pd.read_csv('C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/data/processed_phishing_emails.csv', encoding='utf-8')
df_phishing = df_phishing[['body', 'label']]
df_phishing['body'] = df_phishing['body'].fillna('').astype(str)

# Combine datasets
df_combined = pd.concat([df_legitimate, df_phishing], ignore_index=True)

# Display basic information to verify proper formatting
print(df_combined.head())
print(df_combined['label'].value_counts())

# Vectorize the text data
vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
X = vectorizer.fit_transform(df_combined['body'])
y = df_combined['label'].map({'legitimate': 0, 'phishing': 1})

# Split data for training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = LogisticRegression()
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Save the model and vectorizer
joblib.dump(model, 'C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/models/model3.0.pkl')
joblib.dump(vectorizer, 'C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/models/vectorizer3.0.pkl')

print("Model and vectorizer saved successfully!")