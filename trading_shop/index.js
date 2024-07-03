document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        displayLoggedInUser(user.username);
    }
});

function displayLoggedInUser(username) {
    const registerButton = document.querySelector('.register-button a');
    registerButton.textContent = username;
    registerButton.href = '#'; // Puedes ajustar esto según la lógica de tu aplicación
}
// Array para almacenar los productos agregados al carrito
let cartItems = [];

// Función para agregar un producto al carrito
function addToCart(product) {
    cartItems.push(product);
    updateCartIcon(); // Actualizar ícono de carrito en la barra de navegación
}

// Función para actualizar el ícono del carrito en la barra de navegación
function updateCartIcon() {
    const cartItemCount = document.getElementById('cartItemCount');
    cartItemCount.textContent = cartItems.length; // Mostrar la cantidad de elementos en el carrito
}
document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('loginLink');
    const products = document.querySelectorAll('.product');

    loginLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar que el enlace recargue la página, simulación de inicio de sesión
        alert('Debes iniciar sesión para interactuar con los productos.');
        // Aquí podrías redirigir al usuario a la página de inicio de sesión si lo prefieres
        // window.location.href = 'login.html';
    });

    products.forEach(product => {
        product.querySelector('.view-details').addEventListener('click', function() {
            alert('Debes iniciar sesión para ver más detalles del producto.');
        });

        product.querySelector('.add-to-cart').addEventListener('click', function() {
            alert('Debes iniciar sesión para agregar productos al carrito.');
        });
    });

    // Función ficticia para simular el inicio de sesión
    function isLoggedIn() {
        // Aquí deberías implementar la lógica real para verificar si el usuario está autenticado
        // Por ahora, devolvemos siempre falso para simular que el usuario no está autenticado
        return false;
    }

    // Función para agregar productos al carrito (simulada)
    function addToCart(productName, productPrice) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ name: productName, price: productPrice });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Función para actualizar el contador de la cesta
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cartItemCount').textContent = cart.length;
    }

    // Actualizar el contador de la cesta al cargar la página
    updateCartCount();
});
