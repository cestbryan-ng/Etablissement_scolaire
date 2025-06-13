function showMessage(message, type) {
    console.log('Message affiché:', type, '-', message);
    
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-' + type;
    messageDiv.textContent = message;

    let backgroundColor;
    switch(type) {
        case 'success':
            backgroundColor = '#4CAF50';
            break;
        case 'error':
            backgroundColor = '#f44336';
            break;
        case 'info':
            backgroundColor = '#2196F3';
            break;
        default:
            backgroundColor = '#333';
    }

    messageDiv.style.cssText = 
        'position: fixed;' +
        'top: 20px;' +
        'right: 20px;' +
        'padding: 15px 20px;' +
        'border-radius: 8px;' +
        'color: white;' +
        'font-weight: 600;' +
        'z-index: 1000;' +
        'animation: slideIn 0.3s ease;' +
        'max-width: 300px;' +
        'background-color: ' + backgroundColor + ';';

    document.body.appendChild(messageDiv);

    setTimeout(function() {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

// Fonction pour consulter le planning étudiant
function consulterPlanningEtudiant() {
    console.log('Redirection vers le planning étudiant');
    showMessage('Redirection vers le planning étudiant...', 'info');
    
    setTimeout(function() {
        window.location.href = '/planning-etudiant';
    }, 1500);
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Variables globales
let loginButton;
let buttonText;

// Gestion de l'état de chargement
function setLoadingState(isLoading) {
    if (isLoading) {
        loginButton.disabled = true;
        loginButton.classList.add('loading');
        buttonText.textContent = 'Connexion...';
    } else {
        loginButton.disabled = false;
        loginButton.classList.remove('loading');
        buttonText.textContent = 'Se connecter';
    }
}

// Fonction de gestion de la connexion avec DEBUG
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('=== DEBUG LOGIN ===');
    console.log('Email:', email);
    console.log('Password:', password ? 'fourni' : 'vide');

    // Validation basique
    if (!email || !password) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Veuillez entrer une adresse email valide', 'error');
        return;
    }

    // Affichage du loading
    setLoadingState(true);

    console.log('Tentative de connexion à l\'API...');
    console.log('URL appelée: /api/auth/login');

    // Appel API Spring Boot avec DEBUG
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        console.log('Réponse reçue!');
        console.log('Status:', response.status);
        console.log('Status text:', response.statusText);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
            throw new Error('Erreur HTTP: ' + response.status + ' - ' + response.statusText);
        }
        
        return response.json();
    })
    .then(data => {
        console.log('Données JSON reçues:', data);
        setLoadingState(false);
        
        if (data.success) {
            showMessage('Connexion réussie ! Redirection...', 'success');
            console.log('Redirection vers /accueil dans 1 seconde');
            
            setTimeout(function() {
                window.location.href = '/accueil';
            }, 1000);
        } else {
            console.log('Échec de connexion:', data.message);
            showMessage(data.message || 'Identifiants incorrects', 'error');
        }
    })
    .catch(error => {
        console.error('=== ERREUR DÉTECTÉE ===');
        console.error('Type:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        setLoadingState(false);
        
        // Messages d'erreur plus précis
        if (error.message.includes('Failed to fetch')) {
            showMessage('Spring Boot non accessible. Vérifiez qu\'il est démarré sur le port 8080.', 'error');
        } else if (error.message.includes('NetworkError')) {
            showMessage('Erreur réseau. Vérifiez l\'URL.', 'error');
        } else if (error.message.includes('Erreur HTTP: 404')) {
            showMessage('API non trouvée. Vérifiez le contrôleur Spring Boot.', 'error');
        } else {
            showMessage('Erreur: ' + error.message, 'error');
        }
    });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PAGE CHARGÉE ===');
    console.log('URL actuelle:', window.location.href);
    
    const loginForm = document.getElementById('loginForm');
    loginButton = document.querySelector('.login-button');
    buttonText = document.querySelector('.button-text');

    console.log('Éléments trouvés:');
    console.log('- loginForm:', loginForm ? 'OK' : 'MANQUANT');
    console.log('- loginButton:', loginButton ? 'OK' : 'MANQUANT');
    console.log('- buttonText:', buttonText ? 'OK' : 'MANQUANT');

    // Test de l'API au chargement
    console.log('=== TEST API ===');
    fetch('/api/test/hello')
        .then(response => {
            console.log('Test API - Status:', response.status);
            return response.text();
        })
        .then(data => {
            console.log('Test API - Réponse:', data);
        })
        .catch(error => {
            console.error('Test API - Erreur:', error);
            showMessage('Echec de la connexion', 'error');
        });

    // Gestion de la soumission du formulaire
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            console.log('Formulaire soumis');
            e.preventDefault();
            handleLogin();
        });
    }

    // Animation CSS pour les messages
    const style = document.createElement('style');
    style.textContent = 
        '@keyframes slideIn {' +
        '  from { transform: translateX(100%); opacity: 0; }' +
        '  to { transform: translateX(0); opacity: 1; }' +
        '}' +
        '@keyframes slideOut {' +
        '  from { transform: translateX(0); opacity: 1; }' +
        '  to { transform: translateX(100%); opacity: 0; }' +
        '}';
    document.head.appendChild(style);
    
    console.log('=== INITIALISATION TERMINÉE ===');
});