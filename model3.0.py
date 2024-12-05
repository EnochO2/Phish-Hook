import os
import requests

# Set your API key as an environment variable.
api_key = os.getenv("OPENAI_API_KEY")

# Define the request
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json',
}

data = {
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello, GPT-4!"}],
}

response = requests.post(
    "https://api.openai.com/v1/chat/completions", 
    headers=headers, 
    json=data
)

# Check for response
if response.status_code == 200:
    print(response.json())
else:
    print("Error:", response.status_code, response.text)