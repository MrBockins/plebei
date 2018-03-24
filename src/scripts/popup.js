import axios from "axios";

class App {
  constructor() {
    this.mediaId = document.querySelectorAll('meta[name="rc.idMedia"]')[0].content
    this._injectElement();
  }
  _injectElement() {
    axios({
      method: "get",
      url: chrome.extension.getURL("/templates.html")
    }).then(response => {
      const parser = new DOMParser();
      const template = parser.parseFromString(response.data, "application/xml").querySelector("#templates-popup").innerHTML;
      const parent = document.querySelectorAll(".header-audio-controller")[0];
      parent.insertAdjacentHTML("afterbegin", template)
      
      this._bindEvents();
    });
  }
  _bindEvents() {
    console.log('----------');
    console.log(this.mediaId);
    console.log('----------');
  }
}

new App();
