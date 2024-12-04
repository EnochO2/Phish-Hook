<<<<<<< HEAD
# Phish-Hook: AI-Powered Phishing Detection Tool
## Overview

Phish-Hook is a Chrome extension designed to enhance email security by scanning email content for phishing signs. The idea is for it to work similarly to the Grammarly extension, but instead of finding grammatical errors, it looks for phishing language and malicious intent in the words, URLs, and links.
## Current Status

### Functionality
The extension is set up with the necessary files and permissions. We have `manifest.json`, `background.js`, and `content.js` files in place.

### Injection
The `content.js` script is correctly injected and is responsible for analyzing the Gmail content.
## Code Description

### 1. manifest.json
This file is the configuration file for the Chrome extension. It specifies permissions, background scripts, and other essential settings.

\```json
{
  "manifest_version": 3,
  "name": "Phishing Detector",
  "version": "1.0",
  "description": "Scans email content for phishing signs.",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "https://*/*",
    "http://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "images/icon.png"
  }
}
\```

### 2. background.js
This script handles the injection of the content script into the Gmail context. It listens for events such as the installation of the extension and user interactions.

\```javascript
chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed");
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("mail.google.com")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      console.log("content.js injected");
    });
  }
});
\```

### 3. content.js
This script executes within the Gmail interface. It analyzes the email content by observing changes in the DOM (Document Object Model) and extracts the subject of the email to display it.

\```javascript
console.log("Starting content.js");

function main() {
  console.log("Executing main function");

  const container = document.getElementById('email-analysis-container');
  if (container) {
    console.log("Container found: ", container);
    container.innerHTML = ''; // Clear any previous analysis

    const analysisContainer = document.createElement('div');
    analysisContainer.textContent = "Analysis will be displayed here.";
    container.appendChild(analysisContainer);

    // Function to extract the email subject
    function getEmailSubject() {
      console.log("getEmailSubject function called");
      let subjectElement = document.querySelector('h2.hP');
      if (subjectElement) {
        console.log("Subject element found: ", subjectElement);
        console.log("Subject element attributes: ", subjectElement.attributes);
        console.log("Subject element inner text: ", subjectElement.innerText);
        return subjectElement.innerText.trim();
      } else {
        console.warn("Subject element not found");
        return 'Unknown Subject';
      }
    }

    // MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
      console.log("Mutation observed");

      let emailSubject = getEmailSubject();
      if (emailSubject !== 'Unknown Subject') {
        console.log("Email Subject:", emailSubject);

        // Stop observing once the subject is found
        observer.disconnect();
        
        // Temporarily display the found subject in the container
        const subjectDisplay = document.createElement('div');
        subjectDisplay.textContent = `Detected Subject: ${emailSubject}`;
        container.appendChild(subjectDisplay);
      }
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);
    console.log("MutationObserver started");
  } else {
    console.error("Element with ID 'email-analysis-container' not found.");
  }
}

main();

console.log("content.js script executed");
\```
## Next Steps

1. **Integrate AI Model**:
   - Add the trained AI model into `content.js` to analyze email content for phishing signs.
   - The idea is for it to work similarly to the Grammarly extension, but instead of finding grammatical errors, it looks for phishing language and malicious intent in the words, URLs, and links.
   - *Artifact*: Screenshot of the integration code and example output.

2. **Enhance UI/UX**:
   - Improve the display of analysis results within the Gmail interface.
   - *Artifact*: Screenshot of the updated UI displaying the analysis results.

3. **Conduct Comprehensive Testing**:
   - Ensure all components work seamlessly and validate the AI model’s performance with various email scenarios.
   - *Artifact*: Screenshots of test cases and results.

4. **Finalize Documentation**:
   - Compile all progress and functionalities, including relevant artifacts such as screenshots and code snippets.

## Timeline to Finish by Friday
- **Wednesday**: Complete the AI model integration and enhance the UI/UX.
- **Thursday**: Conduct comprehensive testing and address any issues or bugs found.
- **Friday**: Finalize documentation and prepare the project for submission by 4 PM.
=======
# Phish-Hook
>>>>>>> c3de19d019f826f1010a77cb944d74ae3dafe75b
