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
     let user_post = document.getElementById('post').value;

    fetch('/submit_post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_post: user_post
        })
    })
    .then(response => response.json())
    .then(data => {
            //save post to database
            console.log(data);
        });
}