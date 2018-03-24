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
    let id = 1091185;
    axios({
      method: 'get',
      url: `http://services.radio-canada.ca/neuro/v1/news-stories/${id}`
    })
    .then(function (response) {
      // console.log(response.data.body.html);
    });
  }
}

new Plebei();