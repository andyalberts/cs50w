window.onload=function(){
    var btn = document.getElementById("go-button"); //test
    btn.addEventListener("click", buttonClicked, true); //test
    
    var submit_post = document.getElementById("submit_post");
    submit_post.addEventListener("click", buttonClicked, true);
}

// ------------- test button ------------
function buttonClicked(){
    document.querySelector('#go-text').innerHTML = "Go"
    console.log("Button clicked");
}
//----------------------------------------

function submit_post(event){
    // POST request to submit_post view
    // stringify
    // convert post to json
    //save post, reload page to reflect new post(dynamically)
    
}