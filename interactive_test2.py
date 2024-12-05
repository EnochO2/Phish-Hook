import numpy as np
import joblib
import os
from bs4 import BeautifulSoup
import re
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score

# Define the load paths
model_path = os.path.join('C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/src/phishing-detector-extension', 'model2.0.pkl')
vectorizer_path = os.path.join('C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/src', 'vectorizer.pkl')

# Load the trained model and vectorizer
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

# Function to clean email content
def clean_email(text):
    soup = BeautifulSoup(text, 'html.parser')
    text = soup.get_text()
    text = re.sub(r'\s+', ' ', text)
    return text

# Function to make a prediction on a new email with an adjustable threshold
def predict_email_with_threshold(email_subject, email_body, threshold=0.5):
    full_email = f"{email_subject} {email_body}"
    cleaned_email = clean_email(full_email)
    X_new = vectorizer.transform([cleaned_email])
    probabilities = model.predict_proba(X_new)
    prediction = (probabilities[0][1] >= threshold).astype(int)
    return prediction

# Example usage with multiple emails for broader testing
test_emails = [
    {
        "subject": "Meeting Agenda for Next Week",
        "body": """
        <html>
        <head>
            <title>Meeting Agenda</title>
        </head>
        <body>
            <p>Hi Team,</p>
            <p>Attached is the agenda for our meeting next week. Please review and provide your feedback.</p>
            <p>Best regards,<br>Project Manager</p>
        </body>
        </html>
        """,
        "label": 0  # This is a non-phishing email
    },
    {
        "subject": "Holiday Schedule Update",
        "body": """
        <html>
        <head>
            <title>Holiday Schedule</title>
        </head>
        <body>
            <p>Dear Employees,</p>
            <p>We have updated the holiday schedule for the upcoming season. Please check the attached document for details.</p>
            <p>Happy holidays!<br>HR Team</p>
        </body>
        </html>
        """,
        "label": 0  # This is a non-phishing email
    },
    {
        "subject": "Weekly Newsletter",
        "body": """
        <html>
        <head>
            <title>Weekly Newsletter</title>
        </head>
        <body>
            <p>Hello Subscribers,</p>
            <p>Welcome to this week's edition of our newsletter. We have some exciting updates and articles for you.</p>
            <p>Enjoy reading!<br>Editorial Team</p>
        </body>
        </html>
        """,
        "label": 0  # This is a non-phishing email
    },
    {
        "subject": "Account Verification Required",
        "body": """
        <html>
        <head>
            <title>Account Verification</title>
        </head>
        <body>
            <p>Dear user,</p>
            <p>We noticed some unusual activity on your account. Please click the link below to verify your identity:</p>
            <p><a href="http://suspiciouslink.com">Verify Now</a></p>
            <p>Thank you,<br>Security Team</p>
        </body>
        </html>
        """,
        "label": 1  # This is a phishing email
    }
    # Add more test emails here
]

# Test each email and print the prediction
test_threshold = 0.7  # Example threshold, adjust as needed
predictions = []
true_labels = []

for email in test_emails:
    prediction = predict_email_with_threshold(email["subject"], email["body"], threshold=test_threshold)
    predictions.append(prediction)
    true_labels.append(email["label"])
    print("Subject:", email["subject"])
    print("Prediction:", "Phishing" if prediction == 1 else "Non-Phishing")
    print()

# Calculate and print the scores
accuracy = accuracy_score(true_labels, predictions)
precision = precision_score(true_labels, predictions, zero_division=0)
recall = recall_score(true_labels, predictions, zero_division=0)
f1 = f1_score(true_labels, predictions, zero_division=0)

print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1-Score: {f1:.2f}")

# Print classification report
print("\nClassification Report:\n", classification_report(true_labels, predictions, zero_division=0))
