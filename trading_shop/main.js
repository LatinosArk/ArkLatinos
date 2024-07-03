document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;

            if (username === 'Admin' && password === 'Admin7812') {
                window.location.href = 'admin.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productName = product.querySelector('h3').innerText;
            const productPrice = parseFloat(product.querySelector('h2').innerText.replace('$', ''));

            const productInCart = cart.find(item => item.name === productName);
            if (productInCart) {
                productInCart.quantity++;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        });
    });

    function updateCartCount() {
        const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartItemCount').innerText = cartItemCount;
    }
});
