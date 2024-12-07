document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (apiKey) {
        chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
            document.getElementById('status').textContent = 'API key saved successfully!';
            console.log('API key saved:', apiKey); // Debug log
        });
    } else {
        document.getElementById('status').textContent = 'Please enter a valid API key.';
        console.error('No API key entered.'); // Debug log
    }
});