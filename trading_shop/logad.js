document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('error-message');

    adminLoginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'Admin' && password === 'Admin7812') {
            alert('Inicio de sesión exitoso');
            window.location.href = 'admin.html';
        } else {
            errorMessage.style.display = 'block';
        }
    });
});
