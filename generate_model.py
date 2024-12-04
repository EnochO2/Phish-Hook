from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# Sample data for training
texts = [
    "example email content that is safe",
    "another example of non-phishing email",
    "phishing email content example with risk",
    "yet another example phishing email content"
]
labels = [0, 0, 1, 1]  # 0: non-phishing, 1: phishing

# Vectorize the text data
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

# Train a simple Logistic Regression model
model = LogisticRegression()
model.fit(X, labels)

# Save the model and vectorizer as pickle files
with open('model2.0.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

with open('vectorizer2.0.pkl', 'wb') as vectorizer_file:
    pickle.dump(vectorizer, vectorizer_file)

print("Model and vectorizer saved successfully.")
