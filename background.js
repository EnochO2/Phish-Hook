// // background.js

// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log(`LISTENER RECEIVED REQUEST:\n${Object.keys(request)}`)
//   console.log(getFlaskResponse(request.content))
// }
// );

// const getFlaskResponse = async (emailContent) => {
//   console.log("GETTING FLASK RESPONSE IN background.js")

//   try {
//       const response = await axios.post('http://localhost:5000/analyze', {
//           emailContent: emailContent
//       }, {
//           headers: {
//               'Content-Type': 'application/json'
//           }
//       })
//       console.log(response.data)
//       return response.data
//   } catch (error) {
//       console.error('Error:', error);
//       return { error: 'Failed to analyze email' }
//   }
// }

// // Example event listener for browser actions
// chrome.browserAction.onClicked.addListener((tab) => {
//   // Do something when the extension icon is clicked
// });