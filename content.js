console.log("Starting content.js");
let DATA = {
    score: "No Score receiver",
    summary: "No summary yet"
};

function getEmailSubject() {
    let subjectElement = document.querySelector('h2.hP');
    if (subjectElement) {
        console.log("Email subject found:", subjectElement.innerText.trim());
        return subjectElement.innerText.trim();
    } else {
        console.warn("Email subject not found.");
        return 'Unknown Subject';
    }
}

const observer = new MutationObserver((mutationsList, observer) => {
    console.log("Mutation observed.");
    let emailSubject = getEmailSubject();
    if (emailSubject !== 'Unknown Subject') {
        observer.disconnect(); // Disconnect observer after first detection
        console.log("Observer disconnected.");
        findEmailContent(emailSubject);
    }
});

const config = { childList: true, subtree: true };
observer.observe(document.body, config);
console.log("MutationObserver started.");


const checkForEmail = () => {
    let emailSubject = getEmailSubject();
    if (emailSubject !== 'Unknown Subject') {
        findEmailContent(emailSubject);
    }
}

function findEmailContent(subject) {

    let emailBody = document.querySelector("#\\:1s > div.adn.ads > div.gs > div:nth-child(3)");

    let emailContent = emailBody.textContent

    console.log(`SUBJECT:  + ${subject}`)

    console.log(`EMAIL CONTENT DISPLAYED:\n${emailContent}`)

    DATA = getFlaskResponse(emailContent)

}

const getFlaskResponse = async (emailContent) => {
    console.log("GETTING FLASK RESPONSE IN content.js")
    try {
        const response = await axios.post('http://localhost:5000/analyze', {
            emailContent: emailContent
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error:', error);
        return { error: 'Failed to analyze email' }
    }
}

function displayResult(subject, results) {
    console.log("Displaying result in the Gmail interface.");
    let analysisContainer = document.createElement('div');
    analysisContainer.style.border = "2px solid #FF0000";
    analysisContainer.style.padding = "10px";
    analysisContainer.style.margin = "10px";

    switch (results.score) {
        case "low":
            analysisContainer.style.backgroundColor = "#00FF00"
            break;
        case "medium":
            analysisContainer.style.backgroundColor = "#FFFF00"
            break;
        case "high":
            analysisContainer.style.backgroundColor = "#FF0000"
            break;
    }


    analysisContainer.textContent = `Detected Subject: ${subject}\nClassification: ${results.score}\nSummary: ${results.summary}`;

    let targetNode = document.querySelector('div[role="main"]');
    if (targetNode) {
        targetNode.appendChild(analysisContainer);
        console.log("Analysis container appended to the main container.");
    } else {
        document.body.appendChild(analysisContainer);
        console.log("Analysis container appended to the body.");
    }

    if (results.score === "high") {
        triggerAlert(results);
    }
}

function triggerAlert(results) {
    console.log("Triggering alert for phishing email.");
    alert(`Warning: This email has been classified as Phishing!\n\nTotal Score: ${results.score}`);
}