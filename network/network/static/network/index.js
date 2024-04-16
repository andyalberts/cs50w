document.addEventListener('DOMContentLoaded', function() {
    const submitPostButton = document.querySelector('#submit_post');
    if (submitPostButton) {
        submitPostButton.addEventListener('click', submit_post);
    }

    load_posts();
});



async function submit_post(event){
    event.preventDefault();

    let csrftoken = getCookie('csrftoken');
    // retrieves user post text from input field 
    let text = document.getElementById('post_text').value;
    console.log(text);
    try{

        // retrieves data from fetch, assigns value to response
        const response = await fetch('/submit_post',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
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
function load_posts(){
    //fetch single post and forEach them
    fetch('/get_posts', {
        headers:{
            accept: 'application/json',
        }
    })
    .then(response => {
        // Check if response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return response.json();
    })
    .then(posts => {
        console.log(posts)
        if(!posts.posts || !Array.isArray(posts.posts))
            {
                throw new Error('Invalid post posts received');
            }
        // send posts to render_posts to be displayed
        posts.posts.forEach(post => render_posts(post));
    })
    .catch(error => console.error('Error Loading Post', error));
}

// Display each post sent from load_posts
function render_posts(post){
    const postsDiv = document.createElement('div');
    postsDiv.className = "posts";
    postsDiv.innerHTML=`
   
    <p>${post.text}</p>
    
    `;
    document.querySelector('#display-posts').append(postsDiv); 
        //like button, comment, edit, username (clickable => profile), post time/date

    // event listeners for "like" "comment" "edit"
}