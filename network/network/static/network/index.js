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

// Load posts from users on following list
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
        <div class="card postcard mb-3" id="post-${post.id}" >
        <div class="card-body">
        <h1><a href="/profile/${post.user.id}"> ${post.user.username}</a></h1>
        <p class="post-text">${post.text}</p>
        <div class="edit-area mt-3 d-none">
        <textarea class="form-control mb-2">${post.text}</textarea>
        <button class="btn btn-success save-post" data-post-id="${post.id}">Save</button>
        </div>
        <p>${post.timestamp}</p>
        <p>${post.likes.count} Likes</p>
        <button onclick="likePost(event,'${post.id}')" class="btn btn-primary like-post " data-post-id="${post.id}" >Like</button>
        <button class="btn btn-primary like-post " data-post-id="${post.id}" >like</button>
        <button class="btn btn-primary edit-post " data-post-id="${post.id}" >Edit</button>
        </div>
        </div>
    `).join('');

    // Displays posts on page 
    const postsContainer = document.querySelector('#display-posts');
    if (postsContainer){
        postsContainer.innerHTML="";
        postsContainer.innerHTML = postsHTML + postsContainer.innerHTML;
        window.scrollTo(0,0);
    }

    // ------- edit button functionality --------

   const editButtons = document.querySelectorAll('.edit-post');
   //adds listener to each button in editButtons nodelist
   editButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        const postId = event.target.getAttribute('data-post-id');
        const postElement = document.querySelector(`#post-${postId}`);
        if (postElement){
            postElement.querySelector('.post-text').classList.add('d-none');
            postElement.querySelector('.edit-area').classList.remove('d-none');
        }
    });
   });

   // ----- save button functionality -----
   const saveButtons = document.querySelectorAll('.save-post');
   saveButtons.forEach(button=> {
    button.addEventListener('click', function(event){
        const postId = event.target.getAttribute('data-post-id');
        const postElement = document.querySelector(`#post-${postId}`);
        if (postElement){
            const textarea = postElement.querySelector('.edit-area textarea')
            const postTextElement = postElement.querySelector('.post-text');
            const editedPost = textarea.value;
            // assigns value of user input 'textarea' to post-text and changes to that view
            postTextElement.innerHTML = textarea.value;
            postElement.querySelector('.post-text').classList.remove('d-none');
            postElement.querySelector('.edit-area').classList.add('d-none');
            //MAKE CLICK GO TO savePost FUNCTION
            saveEdit(postId, editedPost);
        }
    });
   });

   // ----- like button functionality -----
//    const likeButtons = document.querySelectorAll('.like-post');
//    likeButtons.forEach(button=>{
//     button.addEventListener('click',function(event){
//         const postId = event.target.getAttribute('data-post-id');
//         const postElement = document.querySelector(`#post-${postId}`);
//         if (postElement){
//         likePost(event,postId);
//     }
//     });
//    });

}

function saveEdit(postId,editedPost){
    //patch post(postId), with editedPost text
    console.log(postId, editedPost);
    let csrftoken = getCookie('csrftoken'); 
    fetch(`/save_edit/${postId}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({
            text:editedPost
        })
    })
    .then(response=>{
        if(response.ok){
            response.json();
            console.log('ok',response);
        }
        else{
            console.error('Failed to save post', response.statusText);
            console.log(response);
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });
}
// Function to follow user
function followUser(event,user_id){
    event.preventDefault();
    fetch(`follow/${user_id}`)
    .then(response=>{
        if(response.ok){
            response.json()
            console.log(response);
            console.log('User followed successfully!!');
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

function likePost(event,postId){
    event.preventDefault();
    console.log(postId);
    fetch(`/like_post/${postId}`) 
    .then(response=>{
        if(response.ok){
            response.json();
            console.log('like',response);
            window.location.reload();
        }
        else{
            console.error('Failed to save post', response.statusText);
            console.log(response);
        }
    })
    .catch(error => {
        console.error('Error', error);
    })
}