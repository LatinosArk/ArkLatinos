document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartButton = document.getElementById('cartButton');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartItemCountElement = document.getElementById('cartItemCount');
    const cartTotalElement = document.getElementById('cartTotal');
    let cartItems = [];
    let cartTotal = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const productPrice = parseFloat(product.querySelector('h2').textContent.replace('$', ''));

            addToCart(productPrice);
            updateCartUI();
        });
    });

    function addToCart(price) {
        cartItems.push(price);
        cartTotal += price;
    }

    function updateCartUI() {
        cartItemCountElement.textContent = cartItems.length;

        // Sumar los precios de todos los productos en el carrito
        cartTotalElement.textContent = `Total: $${cartTotal.toFixed(2)}`;
    }

    cartButton.addEventListener('click', () => {
        cartItemsList.classList.toggle('show');
    });
});
