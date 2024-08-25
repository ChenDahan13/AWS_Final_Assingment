import * as API from './API.js';

document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    const result = await API.AddUserFunction(email, password, phone);
    if (result.error) {
        alert('Error: ' + result.error);
    } else {
        alert('User created successfully!');
        window.location.href = 'index.html';
    }
});
