import axios from "axios";
import {parse,tree2Text, makeItFunny} from "./api";

class App {
  constructor() {
    this.mediaId = document.querySelectorAll('meta[name="rc.idMedia"]')[0];
  
    if(this.mediaId === undefined) {
      return;
    }

    this.mediaId = this.mediaId.content;
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
    return (transform(line)
      .catch(e => { console.error(e); return line})
      .then(tline => to.innerText = tline)
    ); //ICI remplacer par code ALEX...
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
    document.getElementById('plebei-toggle').addEventListener('change', e =>{
      if(e.target.checked) {
        this._getNews(this.mediaId);
      }
    })
  }
}

new App();




let algos = {
  "simple": removeFluff,
  "trololo": makeItFunny,
  "normal": x => x
}


function transform(text, config) {
  return parse(text).then(r=>{
    return new Promise((resolve,reject) => {
      let algo = chrome.storage.sync.get(['algo'], function (algo) {
          resolve(r.parsedData.map(algos[algo]).map(tree2Text).join(" "));
      });
    });
  });
}
