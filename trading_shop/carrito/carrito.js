document.addEventListener("DOMContentLoaded", function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBody = document.getElementById('cartBody');
    const totalAmountSpan = document.getElementById('totalAmount');
    const paypalButton = document.getElementById('paypalButton');
    const discordNameInput = document.getElementById('discordName');

    let totalAmount = 0;

    function renderCart() {
        cartBody.innerHTML = '';
        totalAmount = 0;

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalAmount += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${subtotal.toFixed(2)}</td>
            `;
            cartBody.appendChild(row);
        });

        totalAmountSpan.innerText = totalAmount.toFixed(2);
    }

    renderCart();

    paypalButton.addEventListener('click', function() {
        const discordName = discordNameInput.value.trim();

        if (discordName === '') {
            alert('Por favor, ingrese su nombre de Discord.');
            return;
        }

        const timestamp = new Date().toLocaleString();
        const purchase = {
            timestamp: timestamp,
            items: cart,
            total: totalAmount.toFixed(2),
            discordName: discordName
        };

        // Guardar la compra en localStorage
        let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        // Limpiar el carrito
        localStorage.removeItem('cart');
        cart.length = 0;
        alert('Compra realizada con éxito');

        // Enviar la compra al webhook de Discord
        const webhookUrl = 'https://discord.com/api/webhooks/1257653278880301167/HWD3bPhAEjP0qEzW30iFCba-KpleqRfCMRmm--s7z4BLWdIUoCXuwHN9Tz4c3RZq06h6';
        const mensaje = {
            content: `Nueva compra realizada por: ${discordName}\nTotal: $${purchase.total}\nFecha y hora: ${purchase.timestamp}`,
            embeds: purchase.items.map(item => ({
                title: item.name,
                fields: [
                    { name: 'Precio', value: `$${item.price.toFixed(2)}`, inline: true },
                    { name: 'Cantidad', value: `${item.quantity}`, inline: true },
                    { name: 'Total', value: `$${(item.price * item.quantity).toFixed(2)}`, inline: true }
                ]
            }))
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensaje)
        })
        .then(response => {
            if (response.ok) {
                console.log('Mensaje enviado a Discord');
            } else {
                console.error('Error al enviar el mensaje a Discord');
            }
        })
        .catch(error => {
            console.error('Error al enviar el mensaje a Discord:', error);
        });

        // Redirigir a PayPal
        window.location.href = 'https://www.paypal.me/MarinaNMP';
    });
});
