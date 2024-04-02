// ------------- test button ------------
window.onload=function(){
  var btn = document.getElementById("go-button");
  btn.addEventListener("click", buttonClicked, true);

  var submit_post = document.getElementById("submit_post");
  submit_post.addEventListener("click", buttonClicked, true);
}

function buttonClicked(){
    document.querySelector('#go-text').innerHTML = "Go"
    console.log("Button clicked");
}
//----------------------------------------

