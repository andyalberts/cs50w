document.addEventListener('DOMContentLoaded', function() {
    // submit button for posts
    const submitPostButton = document.querySelector('#submit_post');
    if (submitPostButton) {
        submitPostButton.addEventListener('click', submit_post);
    }

     // -------------- INDEX POST PAGINATOR -------------------
     let currentPage = 1;
     const nextButton = document.querySelector('#next-button');
     const prevButton = document.querySelector('#prev-button');
 
     if (nextButton) {
         nextButton.addEventListener('click', () => {
             document.querySelector('.postcard').innerHTML = '';
             currentPage++;
             load_posts(currentPage);
         });
     }
 
     if (prevButton) {
         prevButton.addEventListener('click', () => {
             if (currentPage > 1) {
                 currentPage--;
                 load_posts(currentPage);
             }
         });
     }
     // load posts on index template
    load_posts(currentPage);

    //---------- follow button ----------
    // follow_button.addEventListener('click', follow_user(target_user_id));
    
    // if (follow_button) {
    //     follow_button.addEventListener('click', follow_user());
       
    // }
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
        load_posts();
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
function load_posts(page){
   
    //fetch single post and forEach them
    fetch(`/posts?page=${page}`, {
        headers:{
            accept: 'application/json',
        }
    })
    .then(response => {
        // Check if response is readable json -> converts to js object
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
        render_posts(posts);
        // posts.posts.forEach(post => render_posts(post));
    })
    .catch(error => console.error('Error Loading Post', error));
}

// Display each post sent from load_posts
function render_posts(post){
  
    const data = post.posts;
    const postsHTML = data.map(post => `
        <div class="card postcard">
            <h1>${post.user}</h1>
            <h5>${post.text}</h5>
            <p>${post.timestamp}</p>
            <p>${post.likes} Likes</p>
        </div>
    `).join('');

    const postsContainer = document.querySelector('#display-posts');
    const userPosts = document.querySelector('#user-posts');
    // only moves forward if on index (postContainer exists)
    if (postsContainer){
        postsContainer.innerHTML="";
        postsContainer.innerHTML = postsHTML + postsContainer.innerHTML;
        window.scrollTo(0,0);
    }
    
   
}


// NEW PLAN: In user_profile view, return everything as jsonresponse instead of rendering w context
// fetch the json info in the JS function and create the html element in this function

// TODO: Change URL to user_profile - use patch method -> avoid reloading page
function follow_user(event,user_id){
    event.preventDefault();
    fetch(`follow/${user_id}`)
    .then(response=>{
        if(response.ok){
            response.json()
            console.log(response);
            console.log('User followed successfully!!')
        } 
        else {
            console.log(response);
            console.error('Failed to follow user', response.statusText);
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });
}
