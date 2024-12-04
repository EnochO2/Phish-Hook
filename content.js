console.log("Starting content.js");

// Function to extract the email subject
function getEmailSubject() {
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

// Use MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList, observer) => {
  let emailSubject = getEmailSubject();
  if (emailSubject !== 'Unknown Subject') {
    console.log("Email Subject:", emailSubject);

    // Stop observing once the subject is found
    observer.disconnect();

    // Proceed with finding email content
    findEmailContent(emailSubject);
  }
});

// Configuration for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Start observing the target node for configured mutations
observer.observe(document.body, config);

function findEmailContent(subject) {
  let potentialEmails = document.querySelectorAll('div, p');
  console.log("Potential email elements found:", potentialEmails.length);

  let emails = [];
  potentialEmails.forEach(element => {
    let textContent = element.innerText.trim();

    // Example criteria: substantial text length and not just "Loading..."
    if (textContent.length > 50 && !textContent.includes("Loading...")) {
      emails.push(element);
      console.log("Potential email content found: ", element);
      console.log("Potential email content: ", element.innerHTML);
    }
  });

  console.log("Filtered email elements found:", emails.length);

  // Filter out the surrounding HTML elements, leaving only significant content
  emails = emails.filter(email => !email.classList.contains('gb_Ea') && !email.classList.contains('a3I'));

  emails.forEach(email => {
    console.log(`Detected email content for subject [${subject}]:`, email.innerHTML);
    chrome.runtime.sendMessage({action: "scan", content: email.innerHTML, subject: subject}, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError);
      } else if (response && response.result) {
        console.log("Risk assessment result:", response.result);
      } else {
        console.error("Response is undefined or does not contain 'result'");
      }
    });
  });

  console.log("Content script execution finished");
}
