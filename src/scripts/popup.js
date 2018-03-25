import axios from "axios";

class App {
  constructor() {
    this.mediaId = document.querySelectorAll('meta[name="rc.idMedia"]')[0].content;
    this.elementContext = undefined;

    this.port = chrome.runtime.connect('ndpiclcbelbammppjdcngmapkndphmmm');
    this._injectElement();
  }
  _injectElement() {
    axios({
      method: "get",
      url: chrome.extension.getURL("/templates.html")
    }).then(response => {
      const parser = new DOMParser();
      const parent = document.querySelectorAll(".bandeau-direct")[0];
      
      const template = parser.parseFromString(response.data, "application/xml").querySelector("#templates-popup").innerHTML;
      parent.insertAdjacentHTML("beforebegin", template)
      
      this.elementContext = parent.querySelector('#plebei-popup');

      this._bindEvents();
    });
  }
  _bindEvents() {

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        console.log(sender.tab ?
          "from a content script:" + sender.tab.url :
          "from the extension");
        if (request.greeting == "hello widget"){
          sendResponse({ farewell: "goodbye 123" });
          console.log('from addlistener')
        }
      });


    chrome.runtime.sendMessage({ greeting: 123 }, function (response) {
      console.log('---POPUP--');
      console.log(response.farewell);
      console.log('-----');
    });

    console.log('----------');
    console.log(this.mediaId);
    console.log('----------');
  }
}

new App();
