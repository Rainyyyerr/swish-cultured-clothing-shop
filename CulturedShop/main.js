import { getCurrentUser, clearCurrentUser } from './authdata.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    const authLink = document.querySelector('.auth-link');
    const userGreeting = document.querySelector('.user-greeting');

    if (currentUser) {
        if (authLink) {
            authLink.textContent = 'LOGOUT';
            authLink.href = '#';
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                clearCurrentUser();
                window.location.reload();
            });
        }

        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${currentUser.username}`;
        }
    } else if (authLink) {
        authLink.textContent = 'LOGIN';
        authLink.href = 'login.html';
    }
    document.querySelector('.logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        
        window.location.href = 'landing.html';
    });
}); 
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('open');
    });
});
