
class App {
  constructor() {
    this.mediaId = document.querySelectorAll('meta[name="rc.idMedia"]')[0].content
    this.bindEvents();
  }
  bindEvents() {
    console.log('----------');
    console.log(this.mediaId);
    console.log('----------');
  }
}

document.onload = function() {
  new App();
};