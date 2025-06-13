// Script pour la page de récapitulatif

// Variables globales
let currentUser = null;

// Fonction utilitaire pour afficher des messages
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

// Validation du format de date jj/mm/aaaa
function isValidDateFormat(dateString) {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return dateRegex.test(dateString);
}

// Conversion de la date jj/mm/aaaa vers objet Date
function parseDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois commencent à 0
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    // Vérifier que la date est valide
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
        return null;
    }
    
    return date;
}

// Validation complète des dates
function validateDates() {
    const dateDebutInput = document.getElementById('dateDebut');
    const dateFinInput = document.getElementById('dateFin');
    
    const dateDebutStr = dateDebutInput.value.trim();
    const dateFinStr = dateFinInput.value.trim();
    
    // Réinitialiser les styles d'erreur
    dateDebutInput.classList.remove('error');
    dateFinInput.classList.remove('error');
    
    // Vérifier que les champs ne sont pas vides
    if (!dateDebutStr || !dateFinStr) {
        showMessage('Veuillez remplir les deux dates', 'error');
        if (!dateDebutStr) dateDebutInput.classList.add('error');
        if (!dateFinStr) dateFinInput.classList.add('error');
        return null;
    }
    
    // Vérifier le format des dates
    if (!isValidDateFormat(dateDebutStr)) {
        showMessage('Format de date de début incorrect. Utilisez jj/mm/aaaa', 'error');
        dateDebutInput.classList.add('error');
        return null;
    }
    
    if (!isValidDateFormat(dateFinStr)) {
        showMessage('Format de date de fin incorrect. Utilisez jj/mm/aaaa', 'error');
        dateFinInput.classList.add('error');
        return null;
    }
    
    // Parser les dates
    const dateDebut = parseDate(dateDebutStr);
    const dateFin = parseDate(dateFinStr);
    
    if (!dateDebut) {
        showMessage('Date de début invalide', 'error');
        dateDebutInput.classList.add('error');
        return null;
    }
    
    if (!dateFin) {
        showMessage('Date de fin invalide', 'error');
        dateFinInput.classList.add('error');
        return null;
    }
    
    // Vérifier la cohérence des dates
    if (dateFin < dateDebut) {
        showMessage('La date de fin doit être postérieure à la date de début', 'error');
        dateFinInput.classList.add('error');
        return null;
    }
    
    return {
        dateDebut: dateDebut,
        dateFin: dateFin,
        dateDebutStr: dateDebutStr,
        dateFinStr: dateFinStr
    };
}

// Fonction pour formater la durée en heures et minutes
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours + 'h' + (mins < 10 ? '0' : '') + mins;
}

// Calculer la durée entre deux heures
function calculateDuration(debut, fin) {
    const debutTime = debut.split(':');
    const finTime = fin.split(':');
    
    const debutMinutes = parseInt(debutTime[0]) * 60 + parseInt(debutTime[1]);
    const finMinutes = parseInt(finTime[0]) * 60 + parseInt(finTime[1]);
    
    return finMinutes - debutMinutes;
}

// Afficher les résultats dans le tableau
function displayResults(reservations, dateDebutStr, dateFinStr) {
    const resultsSection = document.getElementById('resultsSection');
    const noResults = document.getElementById('noResults');
    const periodInfo = document.getElementById('periodInfo');
    const tableBody = document.getElementById('tableBody');
    const totalReservations = document.getElementById('totalReservations');
    const totalHeures = document.getElementById('totalHeures');
    
    if (reservations.length === 0) {
        resultsSection.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    // Afficher la section des résultats
    noResults.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Afficher les informations de période
    periodInfo.textContent = 'Période du ' + dateDebutStr + ' au ' + dateFinStr;
    
    // Vider le tableau
    tableBody.innerHTML = '';
    
    let totalMinutes = 0;
    
    // Ajouter les lignes au tableau
    reservations.forEach(function(reservation) {
        const row = document.createElement('tr');
        
        const duration = calculateDuration(reservation.debut, reservation.fin);
        totalMinutes += duration;
        
        row.innerHTML = 
            '<td>' + reservation.jour + '</td>' +
            '<td>' + reservation.nSalle + '</td>' +
            '<td>' + reservation.debut + '</td>' +
            '<td>' + reservation.fin + '</td>' +
            '<td>' + formatDuration(duration) + '</td>';
        
        tableBody.appendChild(row);
    });
    
    // Mettre à jour le résumé
    totalReservations.textContent = reservations.length;
    totalHeures.textContent = formatDuration(totalMinutes);
}

// Fonction principale de consultation
function consulterRecapitulatif() {
    console.log('=== CONSULTATION RÉCAPITULATIF ===');
    
    // Vérifier l'authentification
    if (!currentUser || !currentUser.matricule) {
        showMessage('Erreur d\'authentification. Veuillez vous reconnecter.', 'error');
        setTimeout(function() {
            window.location.href = '/';
        }, 2000);
        return;
    }
    
    // Valider les dates
    const dateValidation = validateDates();
    if (!dateValidation) {
        return;
    }
    
    // Afficher le loading
    setLoadingState(true);
    
    console.log('Appel API avec matricule:', currentUser.matricule);
    console.log('Période:', dateValidation.dateDebutStr, 'au', dateValidation.dateFinStr);
    
    // Appel à l'API Spring Boot
    fetch('/api/reservations/recapitulatif', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            matricule: currentUser.matricule,
            dateDebut: dateValidation.dateDebutStr,
            dateFin: dateValidation.dateFinStr
        })
    })
    .then(function(response) {
        console.log('Réponse API reçue, status:', response.status);
        if (!response.ok) {
            throw new Error('Erreur HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        console.log('Données reçues:', data);
        setLoadingState(false);
        
        if (data.success) {
            displayResults(data.reservations, dateValidation.dateDebutStr, dateValidation.dateFinStr);
        } else {
            showMessage(data.message || 'Erreur lors de la récupération des données', 'error');
        }
    })
    .catch(function(error) {
        console.error('Erreur:', error);
        setLoadingState(false);
        showMessage('Erreur de connexion à l\'API: ' + error.message, 'error');
    });
}

// Gestion de l'état de chargement
function setLoadingState(isLoading) {
    const button = document.querySelector('.consult-button');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.getElementById('loadingSpinner');
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        buttonText.textContent = 'Consultation...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        buttonText.textContent = 'Consulter le récapitulatif';
    }
}

// Fonction de retour à l'accueil
function retourAccueil() {
    window.location.href = '/accueil.html';
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
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            window.location.href = '/';
        }
    })
    .catch(function(error) {
        console.error('Erreur lors de la déconnexion:', error);
        window.location.href = '/';
    });
}

// Formatage automatique des dates lors de la saisie
function setupDateFormatting() {
    const dateInputs = ['dateDebut', 'dateFin'];
    
    dateInputs.forEach(function(inputId) {
        const input = document.getElementById(inputId);
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Supprimer tout ce qui n'est pas un chiffre
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            if (value.length >= 5) {
                value = value.substring(0, 5) + '/' + value.substring(5, 9);
            }
            
            e.target.value = value;
        });
        
        // Supprimer la classe d'erreur lors de la modification
        input.addEventListener('input', function() {
            input.classList.remove('error');
        });
    });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PAGE RÉCAPITULATIF CHARGÉE ===');
    
    // Vérification de l'authentification
    fetch('/api/auth/user-info', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (!data.success) {
            showMessage('Session expirée. Redirection vers la connexion...', 'error');
            setTimeout(function() {
                window.location.href = '/';
            }, 2000);
        } else {
            // Stocker les informations utilisateur
            currentUser = {
                matricule: data.matricule,
                nom: data.nom,
                grade: data.grade
            };
            
            // Mettre à jour l'affichage utilisateur
            const userNameElement = document.querySelector('.user-info span');
            if (userNameElement) {
                userNameElement.textContent = data.nom + ' (' + data.grade + ')';
            }
            
            console.log('Utilisateur connecté:', currentUser);
        }
    })
    .catch(function(error) {
        console.error('Erreur:', error);
        showMessage('Erreur de vérification de session', 'error');
        setTimeout(function() {
            window.location.href = '/';
        }, 2000);
    });
    
    // Configuration du formatage automatique des dates
    setupDateFormatting();
    
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
    
    // Mettre le focus sur le premier champ de date
    document.getElementById('dateDebut').focus();
    
    console.log('=== INITIALISATION TERMINÉE ===');
});