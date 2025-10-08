document.getElementById('owner-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('owner-password').value;
    if (password === 'ishara2985@#$/?=sold') {
        window.location.href = '/owner.html';
    } else {
        alert('Incorrect password!');
    }
});

document.getElementById('user-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // User login logic (connect to backend API)
    window.location.href = '/user.html';
});
