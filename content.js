console.log("Starting content script.");

// Your model parameters (previously extracted and inserted here)
const modelData = {
    weights: [/* Insert your weights from model_data.json */],
    intercept: [/* Insert intercept here */],
    features: [/* Insert your features here */]
};

// Existing functions...
function vectorize(content) {
    const words = content.toLowerCase().split(/\s+/);
    const featureVector = new Array(modelData.features.length).fill(0);
    words.forEach(word => {
        const index = modelData.features.indexOf(word);
        if (index !== -1) {
            featureVector[index] += 1;
        }
    });
    return featureVector;
}

function predictPhishing(content) {
    const featureVector = vectorize(content);
    let score = modelData.intercept;
    for (let i = 0; i < featureVector.length; i++) {
        score += featureVector[i] * modelData.weights[i];
    }
    const probabilityOfPhishing = 1 / (1 + Math.exp(-score));
    return probabilityOfPhishing > 0.5 ? 'high' : 'low';
}

// The enhanced detection function
function enhancedDetection(subject, body) {
    const suspiciousWords = ["urgent", "immediate", "click here", "secure your account"];
    let suspicionFlag = false;

    suspiciousWords.forEach(word => {
        if (subject.toLowerCase().includes(word) || body.toLowerCase().includes(word)) {
            suspicionFlag = true;
        }
    });

    const modelRisk = predictPhishing(`${subject} ${body}`);
    const combinedRisk = suspicionFlag || modelRisk === 'high';

    return combinedRisk ? "Phishing" : "Non-Phishing";
}

// Update this function to use enhancedDetection
function analyzeContent(subject, body) {
    const risk = enhancedDetection(subject, body);
    displayResult(subject, risk);
}

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
    } else {
        document.body.prepend(analysisContainer);
    }
    
    if (risk === 'Phishing') {
        alert("Warning: This email has been classified as Phishing!");
    }
}

// Observer setup remains the same...
const observer = new MutationObserver(() => {
    analyzeIfReady();
});
const config = { childList: true, subtree: true };
observer.observe(document.body, config);

function getEmailSubject() {
    const subjectElement = document.querySelector('h2.hP') || document.querySelector('.some-other-class');
    return subjectElement ? subjectElement.innerText.trim() : null;
}

function getEmailBody() {
    const bodyElements = document.querySelectorAll('div[role="textbox"], div[role="listitem"]');
    let bodyContent = '';
    bodyElements.forEach(element => {
        bodyContent += element.innerText.trim() + ' ';
    });
    return bodyContent.trim().length === 0 ? null : bodyContent.trim();
}

function analyzeIfReady() {
    const emailSubject = getEmailSubject();
    const emailBody = getEmailBody();
    if (emailSubject && emailBody) {
        observer.disconnect(); // Prevent redundant execution
        analyzeContent(emailSubject, emailBody);
    }
}