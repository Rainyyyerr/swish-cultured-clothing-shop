let users = JSON.parse(localStorage.getItem('swishUsers')) || [
    { username: 'admin', password: 'admin123', email: 'admin@swish.com' }
];
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            this.textContent = input.type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const email = document.getElementById('email')?.value || '';

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            if (users.some(u => u.username === username)) {
                alert('Username already exists!');
                return;
            }

            const newUser = { username, password, email };
            users.push(newUser);
            localStorage.setItem('swishUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            alert('Account created successfully!');
            window.location.href = 'index.html';
        });
    }
});