import axios from "axios";
import {parse,tree2Text, makeItFunny} from "./api";

class App {
  constructor() {
    this.mediaId = document.querySelectorAll('meta[name="rc.idMedia"]')[0].content;
    this.elementContext = undefined;

    this._injectElement();
  }

  _getNews(id){
    axios({
      method: 'get',
      url: `http://services.radio-canada.ca/neuro/v1/news-stories/${id}`
    })
    .then((response)=> {
      let responseHtml = response.data.body.html;
      const parser = new DOMParser();

      let flufflyfied = parser.parseFromString(responseHtml, "text/html");

      let elementsArray = flufflyfied.getElementsByTagName("p");
      let elementsInner =  document.querySelectorAll('.document-body')[0].getElementsByTagName("p");
      let promise = Promise.resolve();
      for(let index = 0; index < elementsArray.length; index++){
        promise = promise.then(() =>
          this._transformLine(elementsArray[index], elementsInner[index])
        );
      }
    });
  }

  _transformLine(from, to){
    const line = from.innerText; 
    return transform(line).then(tline => to.innerText = tline); //ICI remplacer par code ALEX...
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
    });
  }
  _bindEvents() {

  }
}

new App();


function transform(text, config) {
  return parse(text).then(r=>{
    return r.parsedData.map(makeItFunny).map(tree2Text).join(" ");
  }).catch(e => console.error(e));
}