// Contact form validation
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert('Thank you for your message!');
        // In a real application, here you'd send the form data to the server.
    } else {
        alert('Please fill out all fields.');
    }
});
