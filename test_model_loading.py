import pickle

def test_model_loading():
    try:
        with open('C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/src/phishing-detector-extension/model2.0.pkl', 'rb') as model_file:
            model = pickle.load(model_file)
        print("Model loaded successfully")

        with open('C:/Users/odebo/OneDrive/Desktop/Project/Phish-Hook/src/phishing-detector-extension/vectorizer2.0.pkl', 'rb') as vectorizer_file:
            vectorizer = pickle.load(vectorizer_file)
        print("Vectorizer loaded successfully")
    except Exception as e:
        print(f"Error loading model or vectorizer: {e}")

test_model_loading()
