// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static('public')); // Assurez-vous que 'public' contient vos fichiers HTML/CSS/JS

// Fonction pour hacher un mot de passe avec SHA-512
function hashPassword(password) {
    return crypto.createHash('sha512').update(password).digest('hex');
}

// Route de connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);

    // Lire les utilisateurs depuis le fichier JSON
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier:', err);
            return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
        }

        const users = JSON.parse(data);
        const user = users.find(user => user.username === username && user.password === hashedPassword);

        if (user) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
