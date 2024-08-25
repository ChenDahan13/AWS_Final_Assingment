import { uploadPostFunction } from './API.js';

document.addEventListener('DOMContentLoaded', () => {
    // Set the current timestamp to the timePosted input field
    const timePostedInput = document.getElementById('timePosted');
    const now = new Date().toLocaleString();
    timePostedInput.value = now;

    const email = sessionStorage.getItem('email_of_user');

    // Handle form submission
    const form = document.getElementById('uploadPostForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const post = {
            email: email,
            location: form.location.value,
            timePosted: timePostedInput.value,
            photo: form.photo.files[0], // File handling would require additional setup
            caption: form.caption.value,
            tags: form.tags.value.split(',').map(tag => tag.trim())
        };

        try {
            const result = await uploadPostFunction(post);
            alert('Post uploaded successfully!');
            window.location.href = './posts_page.html';
        } catch (error) {
            alert('Failed to upload post. Please try again.');
        }
    });

    // Handle return button click
    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', () => {
        window.location.href = './posts_page.html';
    });
});
