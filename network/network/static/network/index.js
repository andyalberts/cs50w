document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#hide').addEventListener('click', hide);
    
});

function hide(event){  
    event.preventDefault();
    document.querySelector('#body-view').style.display = 'none';
    document.querySelector('#seen').innerHTML = "unlocked";
    console.log('hidden');
}