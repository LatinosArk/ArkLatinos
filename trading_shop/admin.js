document.addEventListener('DOMContentLoaded', () => {
    const dbName = "LatinosArkDB";
    const dbVersion = 1;
    let db;

    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains('users')) {
            const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('username', 'username', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('password', 'password', { unique: false });
            objectStore.createIndex('loginCount', 'loginCount', { unique: false });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadUsers();
        loadPurchases();
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };

    // Agregar usuario
    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const loginCount = 0;

        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');
        const newUser = { username, email, password, loginCount };

        const request = objectStore.add(newUser);

        request.onsuccess = () => {
            alert('Usuario añadido con éxito');
            addUserForm.reset();
            loadUsers(); // Recargar la lista de usuarios después de agregar uno nuevo
        };

        request.onerror = () => {
            alert('Error al añadir el usuario');
        };
    });

    // Eliminar usuario
    const deleteUsersForm = document.getElementById('deleteUsersForm');
    deleteUsersForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userId = Number(document.getElementById('deleteUserId').value);

        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');

        const request = objectStore.delete(userId);

        request.onsuccess = () => {
            alert('Usuario eliminado con éxito');
            deleteUsersForm.reset();
            loadUsers(); // Recargar la lista de usuarios después de eliminar uno
        };

        request.onerror = () => {
            alert('Error al eliminar el usuario');
        };
    });

    // Recargar lista de usuarios
    const reloadUsersButton = document.getElementById('reloadUsersButton');
    reloadUsersButton.addEventListener('click', () => {
        loadUsers();
    });

    // Recargar notificaciones de compra
    const reloadPurchasesButton = document.getElementById('reloadPurchasesButton');
    reloadPurchasesButton.addEventListener('click', () => {
        loadPurchases();
    });

    // Eliminar compra (solo funciona con localStorage en este ejemplo)
    const deletePurchaseForm = document.getElementById('deletePurchaseForm');
    deletePurchaseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const purchaseTimestamp = document.getElementById('deletePurchaseTimestamp').value;

        let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        purchases = purchases.filter(purchase => purchase.timestamp !== purchaseTimestamp);

        localStorage.setItem('purchases', JSON.stringify(purchases));
        alert('Compra eliminada con éxito');
        loadPurchases();
        deletePurchaseForm.reset();
    });

    // Función para cargar usuarios
    function loadUsers() {
        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p>ID: ${cursor.value.id}</p>
                    <p>Usuario: ${cursor.value.username}</p>
                    <p>Email: ${cursor.value.email}</p>
                    <p>Contraseña: ${cursor.value.password}</p>
                    <p>Login Count: ${cursor.value.loginCount}</p>
                `;
                userList.appendChild(listItem);
                cursor.continue();
            }
        };
    }

    // Función para cargar notificaciones de compra (solo funciona con localStorage en este ejemplo)
    function loadPurchases() {
        const purchaseList = document.getElementById('purchaseList');
        purchaseList.innerHTML = '';
        const purchases = JSON.parse(localStorage.getItem('purchases')) || [];

        purchases.forEach(purchase => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p>Cliente: ${purchase.customerName}</p>
                <p>Producto: ${purchase.productName}</p>
                <p>Precio: ${purchase.productPrice}</p>
                <p>Fecha y Hora: ${purchase.timestamp}</p>
            `;
            purchaseList.appendChild(listItem);
        });
    }

    // Inicializar la lista de usuarios y las notificaciones de compra al cargar la página
    loadUsers();
    loadPurchases();

    // Enviar notificación de compra a Discord
    function sendPurchaseNotification(purchase) {
        const webhookUrl = 'TU_URL_DEL_WEBHOOK_AQUI';
        const payload = {
            content: `Nueva compra realizada:\n\n${purchase.items.map(item => `Producto: ${item.name}, Cantidad: ${item.quantity}, Precio Unitario: $${item.price.toFixed(2)}, Total: $${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\nTotal de la compra: $${purchase.total}`
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                console.log('Notificación de compra enviada a Discord.');
            } else {
                console.error('Error al enviar la notificación a Discord.');
            }
        });
    }

    // Detectar nuevas compras
    const purchaseObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const purchaseListItem = mutation.addedNodes[0];
                const timestamp = purchaseListItem.querySelector('p:nth-child(4)').textContent.split(': ')[1];
                const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
                const newPurchase = purchases.find(purchase => purchase.timestamp === timestamp);
                if (newPurchase) {
                    sendPurchaseNotification(newPurchase);
                }
            }
        });
    });

    const purchaseList = document.getElementById('purchaseList');
    purchaseObserver.observe(purchaseList, { childList: true });
});
