document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#send').addEventListener('click', send_email);

  // document.querySelector('#compose-form').addEventListener('submit', send_email);
  
  // By default, load the inbox
  load_mailbox('inbox');
});


// Get the email composition form and add a submit event listener
function send_email(event){
  event.preventDefault();

  let recipients = document.getElementById('compose-recipients').value;
  let subject = document.getElementById('compose-subject').value;
  let body = document.getElementById('compose-body').value;
  
    // Make a POST request to send the email
    fetch('/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');
    });
  };


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
}

function load_mailbox(mailbox) { 
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails)

      // loops through the emails and renders them
      emails.forEach(email => render_inbox(email));
    })
  
  .catch(error => console.error('Error fetching emails:', error));
}

function render_inbox(email){
 
  const emailDiv = document.createElement('div');
  emailDiv.className = "email";
  emailDiv.innerHTML = `
  <strong>${email.sender}</strong>
  <span>${email.subject}</span>
  <span>${email.timestamp}</span>`;
  emailDiv.addEventListener('click', () => view_email(email.id));
  emailDiv.style.backgroundColor = email.read ? 'gray' : 'white';
  document.querySelector('#emails-view').append(emailDiv);
}

function view_email(email_id){
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    // Update innerHTML to display email
    document.querySelector('#emails-view').innerHTML = `
    <h5>From: ${email.sender}</h5>
    <h5>To: ${email.recipients}</h5>
    <h5>Subject: ${email.subject}</h5>
    <p>${email.body}</p>
    <p>${email.timestamp}</p>
    <button id="reply">Reply</button>
    <button id="archive">Archive</button>`;

    // Add event listener to reply button
    document.querySelector('#reply').addEventListener('click', () => reply_email(email_id));
    // Mark email as read
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })
  });  
}

function reply_email(email_id){
  document.querySelector('#reply-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';

  // TODO: fetch options adapted from send_email -- adjust for reply_email
  // !!!!!!!!!! PROBABLY NOT FUNCTIONAL !!!!!!!!!!!!!!!
  fetch(`/emails/${email_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(email => {
    let sender = email.sender;
    var recipientsField = document.getElementById("recipients")
    recipientsField.value = sender;
    
    let sub = email.subject;
    console.log(sub);
    var subField = document.getElementById("reSubject")
    subField.value = `Re: ${sub}`;
  });
}




