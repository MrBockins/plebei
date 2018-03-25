// import axios from "axios";

// class Widget {
//   constructor () {
//     this.bindEvents();
//   }
//   bindEvents() {
//     chrome.runtime.onMessage.addListener(
//       function (request, sender, sendResponse) {
//         console.log(sender.tab ?
//           "from a content script:" + sender.tab.url :
//           "from the extension");
//         if (request.greeting == 123)
//           sendResponse({ farewell: (request.greeting*2) });
//       });

//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello widget" }, function (response) {
//         console.log('---WIDGET--');
//         console.log(response);
//         console.log('-----');
//       });
//     });
//   }
// }

// new Widget();
