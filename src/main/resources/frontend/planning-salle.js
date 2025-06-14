// Script pour la consultation du planning d'une salle

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
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
        return null;
    }
    
    return date;
}

// Validation des champs de recherche
function validateSearchForm() {
    const numeroSalleInput = document.getElementById('numeroSalle');
    const jourConsultationInput = document.getElementById('jourConsultation');
    
    const numeroSalle = numeroSalleInput.value.trim();
    const jourConsultation = jourConsultationInput.value.trim();
    
    // Réinitialiser les styles d'erreur
    numeroSalleInput.classList.remove('error');
    jourConsultationInput.classList.remove('error');
    
    // Vérifier que les champs ne sont pas vides
    if (!numeroSalle || !jourConsultation) {
        showMessage('Veuillez remplir tous les champs', 'error');
        if (!numeroSalle) numeroSalleInput.classList.add('error');
        if (!jourConsultation) jourConsultationInput.classList.add('error');
        return null;
    }
    
    // Vérifier le format de la date
    if (!isValidDateFormat(jourConsultation)) {
        showMessage('Format de date incorrect. Utilisez jj/mm/aaaa', 'error');
        jourConsultationInput.classList.add('error');
        return null;
    }
    
    // Parser la date
    const dateJour = parseDate(jourConsultation);
    if (!dateJour) {
        showMessage('Date invalide', 'error');
        jourConsultationInput.classList.add('error');
        return null;
    }
    
    return {
        numeroSalle: numeroSalle.toUpperCase(),
        jourConsultation: jourConsultation,
        dateJour: dateJour
    };
}

// Générer les créneaux horaires de 8h à 18h
function generateTimeSlots() {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
        const startTime = (hour < 10 ? '0' : '') + hour + ':00';
        const endTime = (hour + 1 < 10 ? '0' : '') + (hour + 1) + ':00';
        slots.push({
            start: startTime,
            end: endTime,
            display: startTime + ' - ' + endTime
        });
    }
    return slots;
}

// Afficher le planning avec réservations
function displayPlanningWithReservations(numeroSalle, jourConsultation, reservations) {
    const resultsSection = document.getElementById('resultsSection');
    const noReservation = document.getElementById('noReservation');
    const salleInexistante = document.getElementById('salleInexistante');
    const salleInfo = document.getElementById('salleInfo');
    const dateInfo = document.getElementById('dateInfo');
    const planningBody = document.getElementById('planningBody');
    const creneauxOccupes = document.getElementById('creneauxOccupes');
    const creneauxLibres = document.getElementById('creneauxLibres');
    
    // Masquer les autres sections
    noReservation.style.display = 'none';
    salleInexistante.style.display = 'none';
    
    // Afficher la section des résultats
    resultsSection.style.display = 'block';
    
    // Mettre à jour les informations
    salleInfo.textContent = numeroSalle;
    dateInfo.textContent = 'Planning du ' + jourConsultation;
    
    // Générer tous les créneaux horaires
    const timeSlots = generateTimeSlots();
    
    // Vider le tableau
    planningBody.innerHTML = '';
    
    let occupiedCount = 0;
    let freeCount = 0;
    
    // Créer une map des réservations par heure
    const reservationMap = {};
    reservations.forEach(function(reservation) {
        const startHour = reservation.debut.substring(0, 5); // Format HH:mm
        reservationMap[startHour] = reservation;
    });
    
    // Générer les lignes du tableau
    timeSlots.forEach(function(slot) {
        const row = document.createElement('tr');
        const reservation = reservationMap[slot.start];
        
        if (reservation) {
            // Créneau occupé
            occupiedCount++;
            row.innerHTML = 
                '<td>' + slot.display + '</td>' +
                '<td><span class="status-occupe">OCCUPÉ</span></td>' +
                '<td>' + (reservation.enseignantNom || 'N/A') + '</td>' +
                '<td>Fin prévue : ' + reservation.fin + '</td>';
        } else {
            // Créneau libre
            freeCount++;
            row.innerHTML = 
                '<td>' + slot.display + '</td>' +
                '<td><span class="status-libre">LIBRE</span></td>' +
                '<td>-</td>' +
                '<td>Disponible pour réservation</td>';
        }
        
        planningBody.appendChild(row);
    });
    
    // Mettre à jour le résumé
    creneauxOccupes.textContent = occupiedCount;
    creneauxLibres.textContent = freeCount;
}

// Afficher "Salle non réservée"
function displaySalleNonReservee(numeroSalle, jourConsultation) {
    const resultsSection = document.getElementById('resultsSection');
    const noReservation = document.getElementById('noReservation');
    const salleInexistante = document.getElementById('salleInexistante');
    const salleNonReservee = document.getElementById('salleNonReservee');
    const dateNonReservee = document.getElementById('dateNonReservee');
    
    // Masquer les autres sections
    resultsSection.style.display = 'none';
    salleInexistante.style.display = 'none';
    
    // Afficher la section "non réservée"
    noReservation.style.display = 'block';
    
    // Mettre à jour les informations
    salleNonReservee.textContent = numeroSalle;
    dateNonReservee.textContent = jourConsultation;
}

// Afficher "Salle inexistante"
function displaySalleInexistante(numeroSalle) {
    const resultsSection = document.getElementById('resultsSection');
    const noReservation = document.getElementById('noReservation');
    const salleInexistante = document.getElementById('salleInexistante');
    const salleErreur = document.getElementById('salleErreur');
    
    // Masquer les autres sections
    resultsSection.style.display = 'none';
    noReservation.style.display = 'none';
    
    // Afficher la section "inexistante"
    salleInexistante.style.display = 'block';
    
    // Mettre à jour les informations
    salleErreur.textContent = numeroSalle;
}

// Fonction principale de recherche du planning
function rechercherPlanning() {
    console.log('=== RECHERCHE PLANNING SALLE ===');
    
    // Valider les champs
    const validation = validateSearchForm();
    if (!validation) {
        return;
    }
    
    // Afficher le loading
    setLoadingState(true);
    
    console.log('Recherche planning pour salle:', validation.numeroSalle);
    console.log('Date:', validation.jourConsultation);
    
    // Appel à l'API Spring Boot
    fetch('/api/planning/salle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            numeroSalle: validation.numeroSalle,
            jourConsultation: validation.jourConsultation
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
            if (data.salleExiste === false) {
                // Salle inexistante
                displaySalleInexistante(validation.numeroSalle);
                showMessage('Salle inexistante', 'error');
            } else if (data.reservations && data.reservations.length > 0) {
                // Salle avec réservations
                displayPlanningWithReservations(validation.numeroSalle, validation.jourConsultation, data.reservations);
                showMessage('Planning chargé avec succès', 'success');
            } else {
                // Salle non réservée
                displaySalleNonReservee(validation.numeroSalle, validation.jourConsultation);
                showMessage('Aucune réservation pour cette salle', 'info');
            }
        } else {
            showMessage(data.message || 'Erreur lors de la récupération du planning', 'error');
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
    const button = document.querySelector('.search-button');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.getElementById('loadingSpinner');
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        buttonText.textContent = 'Recherche...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        buttonText.textContent = 'Rechercher';
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

// Formatage automatique de la date lors de la saisie
function setupDateFormatting() {
    const dateInput = document.getElementById('jourConsultation');
    
    dateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length >= 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        
        e.target.value = value;
    });
    
    // Supprimer la classe d'erreur lors de la modification
    dateInput.addEventListener('input', function() {
        dateInput.classList.remove('error');
    });
    
    // Supprimer la classe d'erreur pour le numéro de salle
    const salleInput = document.getElementById('numeroSalle');
    salleInput.addEventListener('input', function() {
        salleInput.classList.remove('error');
    });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PAGE PLANNING SALLE CHARGÉE ===');
    
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
    
    // Configuration du formatage automatique
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
    
    // Mettre le focus sur le premier champ
    document.getElementById('numeroSalle').focus();
    
    console.log('=== INITIALISATION TERMINÉE ===');
});