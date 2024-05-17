document.addEventListener('DOMContentLoaded', function() {
   //checks current page path
    var path = window.location.pathname;
    console.log(path)
    if (path === '/'){
        const submitPostButton = document.querySelector('#submit_post');
        if (submitPostButton) {
            submitPostButton.addEventListener('click', submitPost);
        }

        // -------------- INDEX POST PAGINATOR -------------------
        let currentPage = 1;
        const nextButton = document.querySelector('#next-button');
        const prevButton = document.querySelector('#prev-button');
    
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                document.querySelector('.postcard').innerHTML = '';
                currentPage++;
                loadPosts(currentPage);
            });
        }
    
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    loadPosts(currentPage);
                }
            });
        }
        // load posts on index template
        loadPosts(currentPage);
    }
    if (path === '/following'){
        const submitPostButton = document.querySelector('#submit_post');
        if (submitPostButton) {
            submitPostButton.addEventListener('click', submitPost);
        }

        // -------------- INDEX POST PAGINATOR -------------------
        let currentPage = 1;
        const nextButton = document.querySelector('#next-button');
        const prevButton = document.querySelector('#prev-button');
    
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                document.querySelector('.postcard').innerHTML = '';
                currentPage++;
                loadFollowingPosts(currentPage);
            });
        }
    
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    loadFollowingPosts(currentPage);
                }
            });
        }
        // load posts on index template
        loadFollowingPosts(currentPage);
    }
   
});

function edit_view(request){
document.querySelector('#post-text').innerHTML = 'none';
}

async function submitPost(event){
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
        loadPosts();
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
function loadPosts(page){
   
    //fetch all posts and paginate them
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
        console.log(response);
        return response.json();
    })
    .then(posts => {
        console.log(posts)
        if(!posts.posts || !Array.isArray(posts.posts))
            {
                throw new Error('Invalid post posts received');
            }
        // send posts to renderPosts to be displayed
        renderPosts(posts);
    })
    .catch(error => console.error('Error Loading Post', error));
}
function loadFollowingPosts(page){
   
    //fetch all posts and paginate them
    fetch(`/following_posts?page=${page}`, {
        headers:{
            accept: 'application/json',
        }
    })
    .then(response => {
        // Check if response is readable json -> converts to js object
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        console.log(response);
        return response.json();
    })
    .then(post => {
        console.log(post)
        if(!post.posts || !Array.isArray(post.posts))
            {
                throw new Error('Invalid post posts received');
            }
        // send posts to renderPosts to be displayed
        renderPosts(post);
    })
    .catch(error => console.error('Error Loading Post', error));
}

// Display each post sent from loadPosts
function renderPosts(post){
    const data = post.posts;
    console.log('Data:', data);
    const postsHTML = data.map(post =>
        `
        <div class="card postcard">
        <h1><a href="/profile/${post.user.id}"> ${post.user.username}</a></h1>
        <p id="post-text">${post.text}</p>
        <p>${post.timestamp}</p>
        <p>${post.likes} Likes</p>
        <button class="edit-post">Edit</button>
        </div>
    `).join('');
    const postsContainer = document.querySelector('#display-posts');
    if (postsContainer){
        postsContainer.innerHTML="";
        postsContainer.innerHTML = postsHTML + postsContainer.innerHTML;
        window.scrollTo(0,0);
    }
   
}

function followUser(event,user_id){
    event.preventDefault();
    fetch(`follow/${user_id}`)
    .then(response=>{
        if(response.ok){
            response.json()
            console.log(response);
            console.log('User followed successfully!!')
            window.location.reload();
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
