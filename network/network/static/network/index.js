document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#submit_post').addEventListener('click', submit_post);
});


async function submit_post(event){
    event.preventDefault();

    // retrieves user post text from input field 
    let text = document.getElementById('post_text').value;
    console.log(text);
    try{

        // retrieves data from fetch, assigns value to response
        const response = await fetch('/submit_post',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                text: text
            })
        });
        // unless it doesn't
        if (!response.ok){
            throw new Error('Network response was not ok');
        }
        // waits for body response to be read as JSON
        const data = await response.json();
        console.log('Success', data);
        // Reset value of post box to blank after post submit
        document.querySelector('#post_text').value = '';
    } catch(error) {
        console.error('Error:', error);
    }

}


// Function to get a cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Load individual posts to send to render_post
function load_posts(request){
    // fetch all posts
    // posts.forEach(post => render_posts)(post)) << something like that
}

// Display each post sent from load_posts
function render_posts(request){
    //createElement div with post cards that need to be run through a for loop
        //like button, comment, edit, username (clickable => profile), post time/date

    // event listeners for "like" "comment" "edit"
}