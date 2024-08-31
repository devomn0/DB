// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static('public')); // 'public' doit contenir vos fichiers HTML/CSS/JS
app.use(session({
    secret: 'votreCleSecrete', // Changez ceci pour une clé secrète unique
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Remplacez par true si vous utilisez HTTPS
}));

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
            req.session.user = user.username; // Stocker le nom d'utilisateur dans la session
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
    });
});

// Route sécurisée pour le tableau de bord
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); // Servir le fichier HTML du tableau de bord
    } else {
        res.redirect('/'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    }
});

// Route de déconnexion
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erreur de déconnexion.' });
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
