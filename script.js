// script.js

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Hashage du mot de passe en SHA-512
    sha512(password).then(hashedPassword => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password: hashedPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/dashboard';
            } else {
                document.getElementById('error-message').innerText = 'Nom d\'utilisateur ou mot de passe incorrect.';
            }
        })
        .catch(error => console.error('Erreur:', error));
    });
});

function sha512(str) {
    const buf = new TextEncoder('utf-8').encode(str);
    return crypto.subtle.digest('SHA-512', buf).then(hash => {
        return hex(hash);
    });
}

function hex(buffer) {
    const hexCodes = [];
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        hexCodes.push(paddedValue);
    }
    return hexCodes.join("");
}
