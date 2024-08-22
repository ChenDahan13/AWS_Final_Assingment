import * as API from './API.js';

document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('mail').value;
  const password = document.getElementById('password').value;

  console.log('email:', email);
  console.log('password:', password);

  const result = await API.GetUserByIdFunction(email);

  console.log('result:', result);
  if (result.email == email && result.password == password) {
    window.location.href = 'posts_page.html';
  } else {
    alert('Invalid username or password');
  }
});

function togglePasswordVisibility() {
  var passwordInput = document.getElementById("password");
  var showPasswordCheckbox = document.getElementById("showPassword");

  // Change the type attribute based on the checkbox state
  passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
}