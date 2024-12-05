document.getElementById('saveKey').addEventListener('click', function() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (apiKey) {
        chrome.storage.local.set({ openaiApiKey: apiKey }, function() {
            alert('API key has been stored.');
        });
    } else {
        alert('Please enter a valid API key.');
    }
});