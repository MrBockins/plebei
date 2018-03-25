import axios from "axios";
//import {parse} from "./api";

class App {
  constructor() {
    this.mediaId = document.querySelectorAll('meta[name="rc.idMedia"]')[0].content;
    
    this.elementContext = undefined;

    this._injectElement();
  }

  _getNews(id){
    console.log('Quering newId => ' + id)
    axios({
      method: 'get',
      url: `http://services.radio-canada.ca/neuro/v1/news-stories/${id}`
    })
    .then(function (response) {
      let responseHtml = response.data.body.html;

      console.log("data", responseHtml);//)
      const parser = new DOMParser();

      
      let flufflyfied = parser.parseFromString(responseHtml, "text/html");

      let elementsArray = flufflyfied.getElementsByTagName("p");
      let elementsInner =  document.querySelectorAll('.document-body')[0].getElementsByTagName("p");
      console.log("inner " + elementsArray.length + ", " + elementsInner.length);
      for(var index = 0; index < elementsArray.length; index++){
        const line = elementsArray[index].innerText; 
        let parsedLine = line + " Sua poudre!!!"; //ICI remplacer par code ALEX...
        elementsInner[index].innerText = parsedLine;
      }

      console.log("flufflyfied => " , flufflyfied);
      //document.querySelectorAll('.document-body')[0].innerHTML = flufflyfied.querySelector('body').innerHTML;
    });
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

      this._getNews(this.mediaId);
      //this._bindEvents();
    });
  }
  _bindEvents() {

  }
}

new App();
