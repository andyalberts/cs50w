document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#submit_post').addEventListener('click', submit_post);
});

// function submit_post(event){
//     event.preventDefault();

//     // POST request to submit_post view
//     let text = document.getElementById('post_text').value;
//     console.log(text);

//     fetch('/submit_post', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken')
//         },
//         body: JSON.stringify({
//             text: text
//         })
//     })
//     .then(response => {
//         // Check if response can return as JSON
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })    
//     .then(data => {
//         console.log('Success:', data);
//         document.querySelector('#post_text').value = '';
//         });
// }

async function submit_post(event){
    event.preventDefault();

    let text = document.getElementById('post_text').value;
    console.log(text);
    try{
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

        if (!response.ok){
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success', data);
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