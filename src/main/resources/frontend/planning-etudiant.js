// Page de planning pour étudiants - AUCUNE AUTHENTIFICATION REQUISE

console.log('📚 Page planning étudiant chargée');

// Fonction utilitaire pour afficher des messages
function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-' + type;
    messageDiv.textContent = message;

    let backgroundColor;
    switch(type) {
        case 'success': backgroundColor = '#4CAF50'; break;
        case 'error': backgroundColor = '#f44336'; break;
        case 'info': backgroundColor = '#2196F3'; break;
        default: backgroundColor = '#333';
    }

    messageDiv.style.cssText = 
        'position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; ' +
        'color: white; font-weight: 600; z-index: 1000; max-width: 300px; ' +
        'background-color: ' + backgroundColor + ';';

    document.body.appendChild(messageDiv);

    setTimeout(function() {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 4000);
}

// Validation des champs
function validateSearchForm() {
    const numeroSalleInput = document.getElementById('numeroSalle');
    const jourConsultationInput = document.getElementById('jourConsultation');
    
    const numeroSalle = numeroSalleInput.value.trim();
    const jourConsultation = jourConsultationInput.value.trim();
    
    // Réinitialiser les styles d'erreur
    numeroSalleInput.classList.remove('error');
    jourConsultationInput.classList.remove('error');
    
    if (!numeroSalle || !jourConsultation) {
        showMessage('Veuillez remplir tous les champs', 'error');
        if (!numeroSalle) numeroSalleInput.classList.add('error');
        if (!jourConsultation) jourConsultationInput.classList.add('error');
        return null;
    }
    
    // Validation format date jj/mm/aaaa
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(jourConsultation)) {
        showMessage('Format de date incorrect. Utilisez jj/mm/aaaa', 'error');
        jourConsultationInput.classList.add('error');
        return null;
    }
    
    return {
        numeroSalle: numeroSalle.toUpperCase(),
        jourConsultation: jourConsultation
    };
}

// Masquer toutes les sections de résultats
function hideAllResultSections() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('noReservation').style.display = 'none';
    document.getElementById('salleInexistante').style.display = 'none';
    document.getElementById('apiError').style.display = 'none';
}

// Génération des créneaux horaires de 8h à 18h
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
    hideAllResultSections();
    
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('salleInfo').textContent = numeroSalle;
    document.getElementById('dateInfo').textContent = 'Planning du ' + jourConsultation;
    
    const timeSlots = generateTimeSlots();
    const planningBody = document.getElementById('planningBody');
    planningBody.innerHTML = '';
    
    let occupiedCount = 0;
    let freeCount = 0;
    
    // Créer map des réservations par heure
    const reservationMap = {};
    reservations.forEach(function(reservation) {
        const startHour = reservation.debut.substring(0, 5);
        reservationMap[startHour] = reservation;
    });
    
    // Générer les lignes du tableau
    timeSlots.forEach(function(slot) {
        const row = document.createElement('tr');
        const reservation = reservationMap[slot.start];
        
        if (reservation) {
            occupiedCount++;
            row.innerHTML = 
                '<td>' + slot.display + '</td>' +
                '<td><span class="status-occupe">OCCUPÉ</span></td>' +
                '<td>' + (reservation.enseignantNom || 'N/A') + '</td>' +
                '<td>Fin prévue : ' + reservation.fin + '</td>';
        } else {
            freeCount++;
            row.innerHTML = 
                '<td>' + slot.display + '</td>' +
                '<td><span class="status-libre">LIBRE</span></td>' +
                '<td>-</td>' +
                '<td>Disponible pour réservation</td>';
        }
        
        planningBody.appendChild(row);
    });
    
    document.getElementById('creneauxOccupes').textContent = occupiedCount;
    document.getElementById('creneauxLibres').textContent = freeCount;
}

// Afficher "Salle non réservée"
function displaySalleNonReservee(numeroSalle, jourConsultation) {
    hideAllResultSections();
    document.getElementById('noReservation').style.display = 'block';
    document.getElementById('salleNonReservee').textContent = numeroSalle;
    document.getElementById('dateNonReservee').textContent = jourConsultation;
}

// Afficher "Salle inexistante"
function displaySalleInexistante(numeroSalle) {
    hideAllResultSections();
    document.getElementById('salleInexistante').style.display = 'block';
    document.getElementById('salleErreur').textContent = numeroSalle;
}

// Afficher erreur API
function displayApiError() {
    hideAllResultSections();
    document.getElementById('apiError').style.display = 'block';
}

// Gestion du loading
function setLoadingState(isLoading) {
    const button = document.querySelector('.search-button');
    const buttonText = button.querySelector('.button-text');
    
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

// Fonction principale de recherche du planning
function rechercherPlanning() {
    console.log('🔍 Recherche planning...');
    
    const validation = validateSearchForm();
    if (!validation) return;
    
    setLoadingState(true);
    hideAllResultSections();
    
    // Essayer d'abord l'API publique
    fetch('/api/public/planning/salle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            numeroSalle: validation.numeroSalle,
            jourConsultation: validation.jourConsultation
        })
    })
    .then(function(response) {
        console.log('✅ Réponse API publique reçue, status:', response.status);
        if (!response.ok) {
            throw new Error('API_PUBLIC_ERROR');
        }
        return response.json();
    })
    .then(function(data) {
        console.log('📊 Données reçues:', data);
        setLoadingState(false);
        
        if (data.success) {
            if (data.salleExiste === false) {
                displaySalleInexistante(validation.numeroSalle);
                showMessage('Salle inexistante', 'error');
            } else if (data.reservations && data.reservations.length > 0) {
                displayPlanningWithReservations(validation.numeroSalle, validation.jourConsultation, data.reservations);
                showMessage('Planning chargé avec succès', 'success');
            } else {
                displaySalleNonReservee(validation.numeroSalle, validation.jourConsultation);
                showMessage('Aucune réservation pour cette salle', 'info');
            }
        } else {
            showMessage(data.message || 'Erreur lors de la récupération du planning', 'error');
        }
    })
    .catch(function(error) {
        console.warn('⚠️ API publique échouée, essai API standard...');
        
        // Si l'API publique échoue, essayer l'API standard
        fetch('/api/planning/salle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numeroSalle: validation.numeroSalle,
                jourConsultation: validation.jourConsultation
            })
        })
        .then(function(response) {
            console.log('✅ Réponse API standard reçue, status:', response.status);
            if (!response.ok) {
                throw new Error('API_STANDARD_ERROR');
            }
            return response.json();
        })
        .then(function(data) {
            console.log('📊 Données API standard reçues:', data);
            setLoadingState(false);
            
            if (data.success) {
                if (data.salleExiste === false) {
                    displaySalleInexistante(validation.numeroSalle);
                    showMessage('Salle inexistante', 'error');
                } else if (data.reservations && data.reservations.length > 0) {
                    displayPlanningWithReservations(validation.numeroSalle, validation.jourConsultation, data.reservations);
                    showMessage('Planning chargé avec succès', 'success');
                } else {
                    displaySalleNonReservee(validation.numeroSalle, validation.jourConsultation);
                    showMessage('Aucune réservation pour cette salle', 'info');
                }
            } else {
                showMessage(data.message || 'Erreur lors de la récupération du planning', 'error');
            }
        })
        .catch(function(error2) {
            console.error('❌ Toutes les API ont échoué:', error2);
            setLoadingState(false);
            displayApiError();
            showMessage('Service temporairement indisponible', 'error');
        });
    });
}

// Fonctions de navigation
function allerSeConnecter() {
    window.location.href = '/authentif.html';
}

function retourAccueil() {
    window.location.href = '/authentif.html';
}

// Formatage automatique de la date
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
    
    // Supprimer les classes d'erreur lors de la modification
    dateInput.addEventListener('input', function() {
        dateInput.classList.remove('error');
    });
    
    const salleInput = document.getElementById('numeroSalle');
    salleInput.addEventListener('input', function() {
        salleInput.classList.remove('error');
    });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Page planning étudiant initialisée');
    
    // Aucune vérification d'authentification - Page 100% publique
    
    // Configuration du formatage automatique
    setupDateFormatting();
    
    // Mettre le focus sur le premier champ
    document.getElementById('numeroSalle').focus();
    
    console.log('✅ Prêt pour consultation publique');
});