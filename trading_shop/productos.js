document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById('productList');
    const cartItemCount = document.getElementById('cartItemCount');

    // Ejemplo de productos (simulación o carga desde una fuente de datos externa)
    const productos = [
        {
            id: 1,
            nombre: '500K Ambar',
            precio: 1.00,
            imagen: 'images/product.jpg'
        },
        {
            id: 2,
            nombre: '1 Millon Ambar',
            precio: 3.00,
            imagen: 'images/product.jpg'
        },
        // Agregar más productos aquí según sea necesario
    ];

    // Función para renderizar la lista de productos
    function renderProductos() {
        productList.innerHTML = '';

        productos.forEach(producto => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <h3>${producto.nombre}</h3>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <p>Precio: $${producto.precio.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al Carrito</button>
            `;
            productList.appendChild(productElement);
        });
    }

    // Evento click para agregar productos al carrito
    productList.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const id = parseInt(event.target.dataset.id);
            const nombre = event.target.dataset.nombre;
            const precio = parseFloat(event.target.dataset.precio);

            // Añadir producto al carrito
            addToCart({ id, nombre, precio, quantity: 1 });

            // Actualizar contador del carrito
            updateCartItemCount();
        }
    });

    // Función para actualizar el contador de ítems del carrito
    function updateCartItemCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let itemCount = 0;
        cart.forEach(item => {
            itemCount += item.quantity;
        });
        cartItemCount.textContent = itemCount;
    }

    // Llamar a la función para renderizar los productos al cargar la página
    renderProductos();
    updateCartItemCount();
});
