console.log("trololo");


document.querySelectorAll("input[type='radio']").forEach(el =>{
  el.addEventListener("click", ev => {
    let id = ev.target.id;
    console.log(id);

    let algo = (id === "one")
        ? "simple"
        : (id === "three")
             ? "trololo"
             : "normal";
    chrome.storage.sync.set({key: algo}, function() {
         console.log('Value is set to ' + algo);
    });
  })
})
