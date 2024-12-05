from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import logging

app = Flask(__name__)

# Ensure the CORS setup allows the required methods and headers
CORS(app, resources={r"/analyze": {"origins": "chrome-extension://<extension-id>"}}, supports_credentials=True)

openai.api_key = os.getenv("OPENAI_API_KEY")

logging.basicConfig(level=logging.DEBUG)

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_email():
    if request.method == 'OPTIONS':
        logging.debug("CORS preflight request received.")
        response = jsonify({'status': 'CORS preflight passed'})
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response, 200

    try:
        content = request.json.get('emailContent')
        if not content:
            logging.error("No email content provided")
            return jsonify({'error': 'No email content provided'}), 400

        logging.debug(f"Email content received for analysis: {content}")

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a skilled assistant in identifying phishing emails."},
                {"role": "user", "content": f"Analyze this email for phishing signs: {content}"}
            ]
        )

        logging.debug(f"OpenAI API Response: {response}")

        try:
            gpt_response = response['choices'][0]['message']['content']
            is_phishing = "phishing" in gpt_response.lower()
            logging.info(f"Email analysis result: {'Phishing' if is_phishing else 'Non-Phishing'}")
            return jsonify({'risk': 'high' if is_phishing else 'low'})

        except (IndexError, KeyError) as e:
            logging.error("Unexpected response from OpenAI:", response)
            return jsonify({'error': 'Unexpected response structure'}), 500

    except Exception as e:
        logging.exception("Error processing request")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)  # Listen on all network interfaces