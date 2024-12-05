document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    
    if (apiKey) {
        chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
            document.getElementById('status').textContent = 'API key saved successfully!';
        });
    } else {
        document.getElementById('status').textContent = 'Please enter a valid API key.';
    }
});