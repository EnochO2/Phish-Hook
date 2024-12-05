chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "analyzeWithGpt") {
      const { content } = request;

      // Retrieve the API Key from storage
      chrome.storage.local.get(['openaiApiKey'], async (result) => {
          const apiKey = result.openaiApiKey;
          
          if (!apiKey) {
              sendResponse({ error: 'API key not set. Please set the API key in the options page.' });
              return;
          }

          try {
              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                      model: 'gpt-4',
                      messages: [
                          { role: "system", content: "You are a phishing detection assistant." },
                          { role: "user", content: `Is this email content a phishing attempt? Email content: ${content}` }
                      ],
                  })
              });
              const data = await response.json();

              if (response.ok) {
                  const risk = data.choices[0].message.includes('phishing') ? 'high' : 'low';
                  sendResponse({ risk });
              } else {
                  console.error('Error from OpenAI:', data);
                  sendResponse({ error: data.error ? data.error.message : 'Unknown error' });
              }
          } catch (error) {
              console.error('Fetch error:', error);
              sendResponse({ error: 'Failed to contact server' });
          }
      });

      return true; // Keeps the message channel open for async response
  }
});