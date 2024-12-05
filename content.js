console.log("Starting content.js");

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

function getEmailBody() {
  let bodyElement = document.querySelectorAll('div[role="textbox"], div[role="listitem"]');
  let bodyContent = '';
  bodyElement.forEach((element) => {
    bodyContent += element.innerText.trim() + ' ';
  });
  console.log("Email body content found:", bodyContent.trim());
  return bodyContent.trim();
}

const observer = new MutationObserver((mutationsList, observer) => {
  console.log("Mutation observed.");
  let emailSubject = getEmailSubject();
  let emailBody = getEmailBody();
  if (emailSubject !== 'Unknown Subject' && emailBody !== '') {
    observer.disconnect(); // Disconnect observer after first detection
    console.log("Observer disconnected.");
    analyzeEmailContent(emailSubject, emailBody);
  }
});

const config = { childList: true, subtree: true };
observer.observe(document.body, config);
console.log("MutationObserver started.");

function analyzeEmailContent(subject, body) {
  let content = subject + ' ' + body;
  chrome.runtime.sendMessage({ action: "scan", content: content, subject: subject }, (response) => {
    if (response && response.result) {
      console.log(`Risk assessment result for subject [${subject}]: ${response.result.classification}`);
      displayResult(subject, response.result, content);
    } else {
      console.error("Error in risk assessment response.");
    }
  });
}

function displayResult(subject, result, content) {
  console.log("Displaying result in the Gmail interface.");
  let analysisContainer = document.createElement('div');
  analysisContainer.style.border = "2px solid #FF0000";
  analysisContainer.style.padding = "10px";
  analysisContainer.style.margin = "10px";
  analysisContainer.style.backgroundColor = result.classification === "Phishing" ? "#FFDDDD" : "#DDFFDD";

  // Create a concise summary of relevant risk words
  let riskWords = result.analysis.match(/(account|password|urgent|immediate action|click here|risk)/ig);
  let analysisSummary = riskWords ? Array.from(new Set(riskWords)).join(', ') : 'None';

  analysisContainer.textContent = `Detected Subject: ${subject}\nClassification: ${result.classification}\nTotal Score: ${result.score}\n\nRisk Words: ${analysisSummary}`;

  let targetNode = document.querySelector('div[role="main"]');
  if (targetNode) {
    targetNode.appendChild(analysisContainer);
    console.log("Analysis container appended to the main container.");
  } else {
    document.body.appendChild(analysisContainer);
    console.log("Analysis container appended to the body.");
  }

  if (result.classification === "Phishing") {
    triggerAlert(result);
  }
}

function triggerAlert(result) {
  console.log("Triggering alert for phishing email.");
  alert(`Warning: This email has been classified as Phishing!\n\nTotal Score: ${result.score}\nRisk Words: ${result.analysis.match(/(account|password|urgent|immediate action|click here|risk)/ig).join(', ')}`);
}
