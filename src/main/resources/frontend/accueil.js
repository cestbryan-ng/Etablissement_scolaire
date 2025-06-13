function reserverSalle() {
    window.location.href = '/reservation-salle';
}

function reserverMateriel() {
    window.location.href = '/reservation-materiel';
}

function consulterPlanning() {
    window.location.href = '/planning';
}

function voirRecapitulatif() {
    window.location.href = 'recapitulatif.html';
}

// Fonction de déconnexion
function logout() {
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Erreur lors de la déconnexion:', error);
        window.location.href = '/';
    });
}

// Vérification de la session au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/auth/user-info', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            // Utilisateur non connecté, redirection
            window.location.href = '/';
        } else {
            // Mettre à jour les informations utilisateur
            updateUserInfo(data);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        window.location.href = '/';
    });
});

// Fonction pour mettre à jour les informations utilisateur
function updateUserInfo(data) {
    const userNameElement = document.querySelector('.user-info span');
    if (userNameElement) {
        userNameElement.textContent = data.nom + ' (' + data.grade + ')';
    }
    
    // Stocker le matricule globalement pour les autres fonctions
    window.currentUser = {
        matricule: data.matricule,
        nom: data.nom,
        grade: data.grade
    };
}