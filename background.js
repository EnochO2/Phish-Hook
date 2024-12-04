console.log("background.js loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request.action);
  if (request.action === "scan") {
    console.log("Scanning email content:", request.content);
    let riskAssessmentResult = assessRisk(request.content);
    sendResponse({ result: riskAssessmentResult });
  }
});

function assessRisk(content) {
  let riskWords = ["urgent", "immediate action", "click here"];
  let riskScore = 0;
  riskWords.forEach(word => {
    if (content.includes(word)) {
      riskScore++;
    }
  });
  return riskScore > 1 ? "high" : "low";
}
