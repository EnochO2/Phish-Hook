document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    // Load the current state
    chrome.storage.sync.get('isDetectionEnabled', function(data) {
        toggleSwitch.checked = data.isDetectionEnabled || false; // Default to off
    });

    // Listen for toggle changes
    toggleSwitch.addEventListener('change', function() {
        const isChecked = toggleSwitch.checked;
        chrome.storage.sync.set({ isDetectionEnabled: isChecked }, function() {
            console.log('Phishing detection is now', isChecked ? 'enabled' : 'disabled');
        });
    });
});