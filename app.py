from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

try:
    with open('model2.0.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
    with open('vectorizer2.0.pkl', 'rb') as vectorizer_file:
        vectorizer = pickle.load(vectorizer_file)
    print("Model and vectorizer loaded successfully")
except Exception as e:
    print(f"Error loading model or vectorizer: {e}")

@app.route('/scan', methods=['POST'])
def scan_email():
    content = request.json.get('content')
    if content:
        try:
            features = vectorizer.transform([content])
            prediction = model.predict(features)
            return jsonify({'risk': 'high' if prediction[0] == 1 else 'low'})
        except Exception as e:
            return jsonify({'error': f'Error processing the email content: {e}'}), 500
    return jsonify({'error': 'No content provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)
