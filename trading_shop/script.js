document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Simular verificación de credenciales (usuario: Admin, contraseña: Admin7812)
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        if (username === 'Admin' && password === 'Admin7812') {
            // Redirigir al usuario al índice (index.html) después del inicio de sesión
            window.location.href = 'index.html';
        } else {
            // Mostrar mensaje de error si las credenciales son incorrectas
            errorMessage.style.display = 'block';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product');
            const productId = productElement.dataset.id;
            const productName = productElement.dataset.name;
            const productPrice = parseFloat(productElement.dataset.price);

            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });
});
