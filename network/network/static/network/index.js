function buttonClicked(){
    document.querySelector('#go-text').innerHTML = "Go"
    console.log("Button clicked");
}

window.onload=function(){
  var btn = document.getElementById("go-button");
  btn.addEventListener("click", buttonClicked, true);
}