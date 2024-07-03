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
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const index = objectStore.index('username');

        const request = index.get(username);

        request.onsuccess = () => {
            const user = request.result;
            if (user && user.password === password) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'index.html'; // Redirigir a la página principal (index.html)
            } else {
                showError();
            }
        };

        request.onerror = () => {
            showError();
        };
    });

    function showError() {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
});
