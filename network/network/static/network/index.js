document.addEventListener('DOMContentLoaded', function(){
// button listeners 
});


function submit_post(event){
    
    // usr and datetime taken care of elsewhere
    let text = document.getElementById('post-text').value;

        fetch('/???', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
}
