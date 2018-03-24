import axios from "axios";

class Plebei {
  constructor () {
    this.bindEvents();
  }
  bindEvents() {
    let fetchBtn = document.querySelectorAll('.js-fetch')[0]
    fetchBtn.addEventListener('click', this.fetchStuff);

    
  }
  fetchStuff() {
    window.getSelection
  }
}

new Plebei();