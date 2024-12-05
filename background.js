console.log("background.js loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan") {
    let riskAssessmentResult = assessRisk(request.content);
    sendResponse({ result: riskAssessmentResult });
  }
});

function assessRisk(content) {
  let riskWords = ["urgent", "immediate action", "click here", "account", "password"];
  let riskScore = 0;
  let foundRiskWords = [];

  riskWords.forEach(word => {
    if (content.includes(word)) {
      riskScore++;
      foundRiskWords.push(word);
    }
  });

  let result = {
    classification: riskScore > 2 ? "Phishing" : "Non-Phishing",
    score: riskScore,
    analysis: `The content contains ${riskScore} risk words: ${foundRiskWords.join(", ")}.`
  };

  return result;
}
