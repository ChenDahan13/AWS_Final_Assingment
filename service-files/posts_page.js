import * as API from './API.js';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const posts = await API.fetchPostsTable();
        const feedsContainer = document.getElementById('feeds');

        posts.forEach(post => {
            const postElement = createPostElement(post);
            feedsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching and displaying posts:', error);
        alert('Failed to load posts. Please try again.');
    }
});

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const email = document.createElement('p');
    email.textContent = `Email: ${post.email}`;
    
    const location = document.createElement('p');
    location.textContent = `Location: ${post.location}`;

    const timePosted = document.createElement('p');
    timePosted.textContent = `Posted on: ${post.timePosted}`;

    const caption = document.createElement('p');
    caption.textContent = post.caption;

    const tags = document.createElement('p');
    tags.textContent = `Tags: ${post.tags}`;

    const img = document.createElement('img');
    img.src = post.photoURL;
    img.alt = 'Post Image';

    postDiv.appendChild(email);
    postDiv.appendChild(location);
    postDiv.appendChild(timePosted);
    postDiv.appendChild(caption);
    postDiv.appendChild(tags);
    postDiv.appendChild(img);

    return postDiv;
}

document.getElementById('upload-profile-picture').addEventListener('change', async function() {
    
    const email_of_user = sessionStorage.getItem('email_of_user');
    console.log('Email:', email_of_user);

    const profilePicture = this.files[0];

    if (!profilePicture) {
        alert('Please select a file');
        return;
    }

    try {
        const base64String = await convertToBase64(profilePicture);
        const result = await API.UploadProfilePictureFunction(email_of_user, base64String);
        if (result.message === 'Profile picture uploaded and user record updated successfully') {
            alert('Profile picture uploaded successfully');
        } else {
            alert('Failed to upload profile picture. Please try again.');
        }
        
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture. Please try again.');
    }

    show_profile_picture(email_of_user);
});

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

async function show_profile_picture(email) {
    const user_details = await API.GetUserByIdFunction(email);
    if(user_details.hasProfilePicture) {
        document.getElementById('profile-picture').src = user_details.profilePictureUrl;
    }
}