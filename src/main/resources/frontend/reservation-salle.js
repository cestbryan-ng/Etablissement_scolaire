// Script pour la réservation de salle

// Variables globales
let currentUser = null;
let currentCriteres = null;
let salleSelectionnee = null;

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

// Validation du format d'heure HH:mm
function isValidTimeFormat(timeString) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(timeString);
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

// Validation complète du formulaire de recherche
function validateSearchForm() {
    const dateInput = document.getElementById('dateReservation');
    const nombrePlacesInput = document.getElementById('nombrePlaces');
    const heureDebutInput = document.getElementById('heureDebut');
    const heureFinInput = document.getElementById('heureFin');
    
    const date = dateInput.value.trim();
    const nombrePlaces = nombrePlacesInput.value.trim();
    const heureDebut = heureDebutInput.value.trim();
    const heureFin = heureFinInput.value.trim();
    
    // Réinitialiser les styles d'erreur
    [dateInput, nombrePlacesInput, heureDebutInput, heureFinInput].forEach(input => {
        input.classList.remove('error');
    });
    
    // Vérifier que les champs ne sont pas vides
    if (!date || !nombrePlaces || !heureDebut || !heureFin) {
        showMessage('Veuillez remplir tous les champs', 'error');
        if (!date) dateInput.classList.add('error');
        if (!nombrePlaces) nombrePlacesInput.classList.add('error');
        if (!heureDebut) heureDebutInput.classList.add('error');
        if (!heureFin) heureFinInput.classList.add('error');
        return null;
    }
    
    // Vérifier le format de la date
    if (!isValidDateFormat(date)) {
        showMessage('Format de date incorrect. Utilisez jj/mm/aaaa', 'error');
        dateInput.classList.add('error');
        return null;
    }
    
    // Parser la date
    const dateObj = parseDate(date);
    if (!dateObj) {
        showMessage('Date invalide', 'error');
        dateInput.classList.add('error');
        return null;
    }
    
    // Vérifier que la date n'est pas dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
        showMessage('La date ne peut pas être dans le passé', 'error');
        dateInput.classList.add('error');
        return null;
    }
    
    // Vérifier le nombre de places
    const places = parseInt(nombrePlaces);
    if (isNaN(places) || places <= 0 || places > 100) {
        showMessage('Le nombre de places doit être entre 1 et 100', 'error');
        nombrePlacesInput.classList.add('error');
        return null;
    }
    
    // Vérifier le format des heures
    if (!isValidTimeFormat(heureDebut)) {
        showMessage('Format d\'heure de début incorrect. Utilisez HH:mm', 'error');
        heureDebutInput.classList.add('error');
        return null;
    }
    
    if (!isValidTimeFormat(heureFin)) {
        showMessage('Format d\'heure de fin incorrect. Utilisez HH:mm', 'error');
        heureFinInput.classList.add('error');
        return null;
    }
    
    // Vérifier la cohérence des heures
    const [heureDebutH, heureDebutM] = heureDebut.split(':').map(Number);
    const [heureFinH, heureFinM] = heureFin.split(':').map(Number);
    
    const minutesDebut = heureDebutH * 60 + heureDebutM;
    const minutesFin = heureFinH * 60 + heureFinM;
    
    if (minutesFin <= minutesDebut) {
        showMessage('L\'heure de fin doit être postérieure à l\'heure de début', 'error');
        heureFinInput.classList.add('error');
        return null;
    }
    
    // Vérifier les heures d'ouverture (8h-18h)
    if (minutesDebut < 8 * 60 || minutesFin > 18 * 60) {
        showMessage('Les heures doivent être entre 08:00 et 18:00', 'error');
        if (minutesDebut < 8 * 60) heureDebutInput.classList.add('error');
        if (minutesFin > 18 * 60) heureFinInput.classList.add('error');
        return null;
    }
    
    return {
        date: date,
        nombrePlaces: places,
        heureDebut: heureDebut,
        heureFin: heureFin
    };
}

// Rechercher les salles disponibles
function rechercherSalles() {
    console.log('=== RECHERCHE SALLES DISPONIBLES ===');
    
    // Valider le formulaire
    const validation = validateSearchForm();
    if (!validation) {
        return;
    }
    
    // Afficher le loading
    setLoadingState('search', true);
    
    // Stocker les critères
    currentCriteres = validation;
    
    console.log('Critères de recherche:', currentCriteres);
    
    // Appel à l'API
    fetch('/api/reservation/rechercher-salles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            date: validation.date,
            heureDebut: validation.heureDebut,
            heureFin: validation.heureFin,
            nombrePlacesMin: validation.nombrePlaces
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
        setLoadingState('search', false);
        
        if (data.success) {
            if (data.sallesDisponibles && data.sallesDisponibles.length > 0) {
                afficherSallesDisponibles(data.sallesDisponibles, data.periode);
            } else {
                afficherAucuneSalle(data.message);
            }
        } else {
            showMessage(data.message || 'Erreur lors de la recherche', 'error');
        }
    })
    .catch(function(error) {
        console.error('Erreur:', error);
        setLoadingState('search', false);
        showMessage('Erreur de connexion à l\'API: ' + error.message, 'error');
    });
}

// Afficher les salles disponibles
function afficherSallesDisponibles(salles, periode) {
    console.log('Affichage des salles:', salles);
    
    // Masquer les autres sections
    masquerToutesLesEtapes();
    
    // Afficher l'étape 2
    document.getElementById('step2').style.display = 'block';
    
    // Mettre à jour le texte d'information
    document.getElementById('criteresInfo').textContent = 
        'Période : ' + periode + ' - ' + salles.length + ' salle(s) disponible(s)';
    
    // Générer les cartes de salles
    const sallesGrid = document.getElementById('sallesGrid');
    sallesGrid.innerHTML = '';
    
    salles.forEach(function(salle) {
        const salleCard = document.createElement('div');
        salleCard.className = 'salle-card';
        salleCard.onclick = function() { selectionnerSalle(salle, salleCard); };
        
        salleCard.innerHTML = 
            '<div class="salle-icon">🏛️</div>' +
            '<div class="salle-name">Salle ' + salle.numeroSalle + '</div>' +
            '<div class="salle-capacity">' + salle.capacite + ' places</div>';
        
        sallesGrid.appendChild(salleCard);
    });
    
    // Réinitialiser la sélection
    salleSelectionnee = null;
}

// Sélectionner une salle
function selectionnerSalle(salle, cardElement) {
    console.log('Salle sélectionnée:', salle);
    
    // Désélectionner les autres cartes
    document.querySelectorAll('.salle-card').forEach(function(card) {
        card.classList.remove('selected');
    });
    
    // Sélectionner cette carte
    cardElement.classList.add('selected');
    
    // Stocker la salle sélectionnée
    salleSelectionnee = salle;
    
    // Afficher l'étape de confirmation
    setTimeout(function() {
        afficherConfirmation();
    }, 300);
}

// Afficher la confirmation
function afficherConfirmation() {
    console.log('Affichage de la confirmation');
    
    // Masquer les autres sections
    masquerToutesLesEtapes();
    
    // Afficher l'étape 3
    document.getElementById('step3').style.display = 'block';
    
    // Générer les détails de confirmation
    const confirmationDetails = document.getElementById('confirmationDetails');
    confirmationDetails.innerHTML = 
        '<div class="detail-row">' +
        '    <span class="detail-label">Salle :</span>' +
        '    <span class="detail-value">Salle ' + salleSelectionnee.numeroSalle + '</span>' +  // Utilise numeroSalle
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Capacité :</span>' +
        '    <span class="detail-value">' + salleSelectionnee.capacite + ' places</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Date :</span>' +
        '    <span class="detail-value">' + currentCriteres.date + '</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Horaire :</span>' +
        '    <span class="detail-value">' + currentCriteres.heureDebut + ' - ' + currentCriteres.heureFin + '</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Durée :</span>' +
        '    <span class="detail-value">' + calculerDuree(currentCriteres.heureDebut, currentCriteres.heureFin) + '</span>' +
        '</div>';
}

// Calculer la durée entre deux heures
function calculerDuree(debut, fin) {
    const [heureDebutH, heureDebutM] = debut.split(':').map(Number);
    const [heureFinH, heureFinM] = fin.split(':').map(Number);
    
    const minutesDebut = heureDebutH * 60 + heureDebutM;
    const minutesFin = heureFinH * 60 + heureFinM;
    
    const dureeMinutes = minutesFin - minutesDebut;
    const heures = Math.floor(dureeMinutes / 60);
    const minutes = dureeMinutes % 60;
    
    return heures + 'h' + (minutes < 10 ? '0' : '') + minutes;
}

// Confirmer la réservation
function confirmerReservation() {
    console.log('=== CONFIRMATION RÉSERVATION ===');
    
    if (!salleSelectionnee || !currentCriteres) {
        showMessage('Erreur: données manquantes', 'error');
        return;
    }
    
    // Afficher le loading
    setLoadingState('confirm', true);
    
    console.log('Confirmation réservation pour salle:', salleSelectionnee.numeroSalle);  // Utilise numeroSalle
    
    // Appel à l'API
    fetch('/api/reservation/confirmer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            numeroSalle: salleSelectionnee.numeroSalle,  // Utilise numeroSalle
            date: currentCriteres.date,
            heureDebut: currentCriteres.heureDebut,
            heureFin: currentCriteres.heureFin
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
        setLoadingState('confirm', false);
        
        if (data.success) {
            afficherSucces(data);
            showMessage('Réservation confirmée avec succès !', 'success');
        } else {
            showMessage(data.message || 'Erreur lors de la confirmation', 'error');
        }
    })
    .catch(function(error) {
        console.error('Erreur:', error);
        setLoadingState('confirm', false);
        showMessage('Erreur de connexion à l\'API: ' + error.message, 'error');
    });
}

// Afficher le succès
function afficherSucces(data) {
    console.log('Affichage du succès');
    
    // Masquer les autres sections
    masquerToutesLesEtapes();
    
    // Afficher la section de succès
    document.getElementById('success').style.display = 'block';
    
    // Générer les détails de succès
    const successDetails = document.getElementById('successDetails');
    successDetails.innerHTML = 
        '<div class="detail-row">' +
        '    <span class="detail-label">Code de réservation :</span>' +
        '    <span class="detail-value"><strong>' + data.codeReservation + '</strong></span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Salle :</span>' +
        '    <span class="detail-value">Salle ' + salleSelectionnee.numeroSalle + '</span>' +  // Utilise numeroSalle
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Période :</span>' +
        '    <span class="detail-value">' + data.periode + '</span>' +
        '</div>';
}

// Afficher aucune salle disponible
function afficherAucuneSalle(message) {
    console.log('Aucune salle disponible:', message);
    
    // Masquer les autres sections
    masquerToutesLesEtapes();
    
    // Afficher la section aucune salle
    document.getElementById('noSalles').style.display = 'block';
    document.getElementById('noSallesMessage').textContent = message;
}

// Masquer toutes les étapes
function masquerToutesLesEtapes() {
    ['step1', 'step2', 'step3', 'success', 'noSalles'].forEach(function(id) {
        document.getElementById(id).style.display = 'none';
    });
}

// Navigation entre les étapes
function retourRecherche() {
    masquerToutesLesEtapes();
    document.getElementById('step1').style.display = 'block';
    salleSelectionnee = null;
}

function retourSelection() {
    masquerToutesLesEtapes();
    document.getElementById('step2').style.display = 'block';
}

function nouvelleReservation() {
    // Réinitialiser les données
    currentCriteres = null;
    salleSelectionnee = null;
    
    // Vider les champs
    document.getElementById('dateReservation').value = '';
    document.getElementById('nombrePlaces').value = '';
    document.getElementById('heureDebut').value = '';
    document.getElementById('heureFin').value = '';
    
    // Retour à l'étape 1
    retourRecherche();
}

// Gestion de l'état de chargement
function setLoadingState(type, isLoading) {
    let button, buttonText, spinner;
    
    if (type === 'search') {
        button = document.querySelector('.search-button');
        buttonText = button.querySelector('.button-text');
        spinner = document.getElementById('loadingSpinner1');
    } else if (type === 'confirm') {
        button = document.querySelector('.confirm-button');
        buttonText = button.querySelector('.button-text');
        spinner = document.getElementById('loadingSpinner3');
    }
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        if (type === 'search') {
            buttonText.textContent = 'Recherche...';
        } else {
            buttonText.textContent = 'Confirmation...';
        }
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        if (type === 'search') {
            buttonText.textContent = 'Rechercher les salles disponibles';
        } else {
            buttonText.textContent = 'Confirmer la réservation';
        }
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

// Formatage automatique des champs
function setupFormatting() {
    // Formatage automatique de la date
    const dateInput = document.getElementById('dateReservation');
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
    
    // Formatage automatique des heures
    ['heureDebut', 'heureFin'].forEach(function(id) {
        const input = document.getElementById(id);
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + ':' + value.substring(2, 4);
            }
            
            e.target.value = value;
        });
    });
    
    // Supprimer les classes d'erreur lors de la modification
    ['dateReservation', 'nombrePlaces', 'heureDebut', 'heureFin'].forEach(function(id) {
        document.getElementById(id).addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PAGE RÉSERVATION SALLE CHARGÉE ===');
    
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
    setupFormatting();
    
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
    document.getElementById('dateReservation').focus();
    
    console.log('=== INITIALISATION TERMINÉE ===');
});