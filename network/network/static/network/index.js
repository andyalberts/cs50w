// ----- JQuery Button Example -----
$(document).ready(function(){
   //----- test button -----
    $(".test-button").hover(
        function(){
            $(":visible").css(
                "color", "green"
        );
    },
        function(){
            $(":visible").css(
                "color", ""
        );
    }
    );
    
});

// ----- MAIN DOCUMENT -----
document.addEventListener('DOMContentLoaded', function() {
   //checks current page path
    var path = window.location.pathname;
    console.log(path);
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
    if (path === '/login'){
        document.querySelector('.user-info-block').classList.add('d-none');
    }
});


async function submitPost(event){
    event.preventDefault();

    let csrftoken = getCookie('csrftoken');
    // retrieves user post text from input field 
    let text = document.getElementById('post-textbox').value;
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
        document.querySelector('#post-textbox').value = '';
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
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return response.json();
    })
    .then(posts => {
        const currentUserId = posts.current_user_id;
        console.log(posts);
        console.log("userID", currentUserId);
        // Validation Check, if either return True, throw error
        if(!posts.posts || !Array.isArray(posts.posts))
            {
                throw new Error('Invalid post posts received');
            }
        // send posts to renderPosts to be displayed
        renderPosts(posts,currentUserId);
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
function renderPosts(post, currentUserId){
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
            <button class="btn btn-secondary save-post" data-post-id="${post.id}">Save</button>
            <button class="btn btn-secondary cancel-edit" data-post-id="${post.id}">Back</button>
        </div>
        <p>${post.timestamp}</p>
        <p id="like-count-${post.id}">${post.likes.count} Likes</p>
        <button class="btn btn-secondary comment-button" data-post-id="${post.id}">comment</button>
        <button class="btn btn-secondary comments-toggle" data-post-id="${post.id}">comments</button>
        <button class="btn btn-secondary like-button" id="like-button-${post.id }" data-post-id="${post.id }">like</button>
        ${post.user.id == currentUserId ? `<button class="btn btn-secondary edit-post" data-post-id="${post.id}">Edit</button>` : ''}
        </div>
        <div class="comment-area d-none m-4">
            <textarea class="form-control mb-2"></textarea>
            <button class="btn btn-success post-comment" data-post-id="${post.id}">Post</button>
        </div>
        <div class="comments-view-${post.id} d-none"></div>
        </div>
        `).join('');
    // Displays posts on page 
    const postsContainer = document.querySelector('#display-posts');
    if (postsContainer){
        postsContainer.innerHTML="";
        postsContainer.innerHTML = postsHTML + postsContainer.innerHTML;
        window.scrollTo(0,0);
    }
    // ------- Open Edit View --------
   const editButtons = document.querySelectorAll('.edit-post');
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
    // ----- Open Comment View -----
    const commentButton = document.querySelectorAll('.comment-button');
    const commentArea = document.querySelector('.comment-area');
    commentButton.forEach(button => {
    button.addEventListener('click', function(event) {
        const postId = event.target.getAttribute('data-post-id');
        const postElement = document.querySelector(`#post-${postId}`);
        if (postElement){
            // postElement.querySelector('.comment-area').classList.remove('d-none');
            toggleContent('.comment-area');
        }
    });
    });
   // ----- submit edit -----
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
            postTextElement.innerHTML = editedPost;
            postElement.querySelector('.post-text').classList.remove('d-none');
            postElement.querySelector('.edit-area').classList.add('d-none');
            //MAKE CLICK GO TO savePost FUNCTION
            saveEdit(postId, editedPost);
        }
    });
   });
   // ---- cancel edit -----
   const cancelEdit = document.querySelectorAll('.cancel-edit');
   cancelEdit.forEach(button=> {
    button.addEventListener('click', function(event){
        const postId = event.target.getAttribute('data-post-id');
        const postElement = document.querySelector(`#post-${postId}`);
        if (postElement){
            postElement.querySelector('.post-text').classList.remove('d-none');
            postElement.querySelector('.edit-area').classList.add('d-none');
        }
    });
   });
   // ----- comment post button functionality -----
   const postComment = document.querySelectorAll('.post-comment');
   postComment.forEach(button=> {
    button.addEventListener('click', function(event){
        const postId = event.target.getAttribute('data-post-id');
        const postElement = document.querySelector(`#post-${postId}`);
        if (postElement){
            const textarea = postElement.querySelector('.comment-area textarea')
            const commentText = textarea.value;
            postElement.querySelector('.comment-area').classList.add('d-none');
            console.log(postId, commentText);
            saveComment(postId, commentText);
        }
    });
   });
   // ----- like button functionality -----
   const likeButtons = document.querySelectorAll('.like-button');
   likeButtons.forEach(button=>{
    button.addEventListener('click',function(event){
        const postId = event.target.getAttribute('data-post-id');
        const postElement = document.querySelector(`#post-${postId}`);
        if (postElement){
            postLikes = postElement.querySelector(`#like-count-${postId}`);
            likePost(event,postId);
    }
    });
   });
   // ----- Comments View -----
   const commentsToggle = document.querySelectorAll('.comments-toggle');
   commentsToggle.forEach(button=> {
    button.addEventListener('click', function(event){
        const postId = event.target.getAttribute('data-post-id');
        const postElement = document.querySelector(`#post-${postId}`);

        if(postElement){
            commentsView = document.querySelector('.comments-view');
            console.log("PostId:", postId);
            loadComments(postId);
        }
    });
   });
}
function loadComments(postId){
    fetch(`/load_comments/${postId}`, {
        headers:{
            accept: 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return response.json();
    })
    .then(comments => {  
        if(!comments.comments || !Array.isArray(comments.comments))
            {
                throw new Error('Invalid comments received')
            }   
        renderComments(comments, postId);
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', console.error('Error Loading Comments', error));
    });
}
function renderComments(comments,postId){
    const data = comments.comments;
    console.log('Data:',data);
    const commentsHTML = data.map(comment =>`
    <div class="rendered-comments">
    <h2>${comment.user.username}</h2>
    <p>${comment.text}</p>
    </div>    
    `
    ).join('')
    const commentsView = document.querySelector(`.comments-view-${postId}`);
    commentsView.classList.toggle("d-none");
    if (commentsView){
        commentsView.innerHTML="";
        commentsView.innerHTML = commentsHTML + commentsView.innerHTML;
    }
}
function saveComment(postId, commentText){
    console.log(postId, commentText);
    let csrftoken = getCookie('csrftoken'); 
    fetch(`/post_comment/${postId}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({
            text:commentText
        })
    })
    .then(response=>{
        if(response.ok){
            response.json();
            console.log('ok',response);
        }
        else{
            console.error('Failed to post comment', response.statusText);
            console.log(response);
        }
    })
    .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
    });
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
    const csrftoken = getCookie('csrftoken');

    fetch(`/like_post/${postId}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        }) 
    .then(response=>{
        if(response.ok){
            return response.json();
         }
        else{
            console.error('Failed to save post', response.statusText);
            console.log(response);
        }
    })
    .then(data => {
        if (data) {
            console.log("itsdata", data);
            // Update the DOM with the new like count and like status
            document.getElementById(`like-count-${postId}`).textContent = data.count + " likes";
            const likeButton = document.getElementById(`like-button-${postId}`);
            likeButton.textContent = data.liked ? 'Unlike' : 'Like';
           
        }
    })
    .catch(error => {
        console.error('Error', error);
    });    
}

function toggleContent(element) {
    var content = document.querySelector(element);
    if (content.classList.contains('d-none')) {
      content.classList.remove('d-none');
    } else {
      content.classList.add('d-none');
    }
  }