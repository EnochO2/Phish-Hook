console.log("Starting content script.");

// Function to get the email subject
function getEmailSubject() {
    const subjectElement = document.querySelector('h2.hP') || document.querySelector('.some-other-class');
    if (subjectElement) {
        console.log("Email subject found:", subjectElement.innerText.trim());
        return subjectElement.innerText.trim();
    } else {
        console.warn("Email subject not found.");
        return null;
    }
}

// Function to get the email body
function getEmailBody() {
    const bodyElements = document.querySelectorAll('div[role="textbox"], div[role="listitem"]');
    let bodyContent = '';
    bodyElements.forEach(element => {
        bodyContent += element.innerText.trim() + ' ';
    });

    if (bodyContent.trim().length === 0) {
        console.warn("Email body content is empty.");
        return null;
    } else {
        console.log("Email body content found:", bodyContent.trim());
        return bodyContent.trim();
    }
}

// Analyze content when both subject and body are available
function analyzeIfReady() {
    const emailSubject = getEmailSubject();
    const emailBody = getEmailBody();

    if (emailSubject && emailBody) {
        observer.disconnect();
        console.log("Observer disconnected.");
        analyzeContent(emailSubject, emailBody);
    } else {
        console.log("Waiting for full content to load.");
    }
}

// MutationObserver to monitor changes in the DOM
const observer = new MutationObserver(() => {
    console.log("Mutation observed.");
    analyzeIfReady();
});

// Start observing the DOM for changes
const config = { childList: true, subtree: true };
observer.observe(document.body, config);
console.log("MutationObserver started with configuration:", config);

// Function to send email content for analysis
function analyzeContent(subject, body) {
    console.log(`Analyzing content with subject: ${subject}`);
    const content = `${subject} ${body}`;

    chrome.runtime.sendMessage({ action: "analyzeWithGpt", content }, (response) => {
        if (response.error) {
            console.error('Analysis error:', response.error);
            displayAlert(response.error);
        } else {
            const classification = response.risk === 'high' ? "Phishing" : "Non-Phishing";
            displayResult(subject, classification);
        }
    });
}

// Function to display the analysis result in the UI
function displayResult(subject, risk) {
    let analysisContainer = document.createElement('div');
    analysisContainer.style.border = "2px solid #FF0000";
    analysisContainer.style.padding = "10px";
    analysisContainer.style.margin = "10px";
    analysisContainer.style.backgroundColor = risk === 'Phishing' ? "#FFDDDD" : "#DDFFDD";

    analysisContainer.textContent = `Detected Subject: ${subject}\nClassification: ${risk}`;

    const targetNode = document.querySelector('div[role="main"]');
    if (targetNode) {
        targetNode.prepend(analysisContainer);
        console.log("Analysis container prepended to the main container.");
    } else {
        document.body.prepend(analysisContainer);
        console.log("Analysis container prepended to the body.");
    }

    if (risk === 'Phishing') {
        alert("Warning: This email has been classified as Phishing!");
    }
}

// Function to notify the user if there's an error
function displayAlert(message) {
    alert("Error: " + message);
}