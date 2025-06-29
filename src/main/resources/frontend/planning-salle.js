// Variables globales
let currentUser = null;

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
    const numeroSalle = document.getElementById('numeroSalle').value.trim();
    const jourConsultation = document.getElementById('jourConsultation').value.trim();
    
    if (!numeroSalle || !jourConsultation) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return null;
    }
    
    return {
        numeroSalle: numeroSalle.toUpperCase(),
        jourConsultation: jourConsultation
    };
}

// Génération des créneaux horaires
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

// Affichage du planning avec réservations
function displayPlanningWithReservations(numeroSalle, jourConsultation, reservations) {
    // Masquer autres sections
    document.getElementById('noReservation').style.display = 'none';
    document.getElementById('salleInexistante').style.display = 'none';
    
    // Afficher résultats
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('salleInfo').textContent = numeroSalle;
    document.getElementById('dateInfo').textContent = 'Planning du ' + jourConsultation;
    
    const timeSlots = generateTimeSlots();
    const planningBody = document.getElementById('planningBody');
    planningBody.innerHTML = '';
    
    let occupiedCount = 0;
    let freeCount = 0;
    
    // Créer map des réservations
    const reservationMap = {};
    reservations.forEach(function(reservation) {
        const startHour = reservation.debut.substring(0, 5);
        reservationMap[startHour] = reservation;
    });
    
    // Générer les lignes
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

// Affichage salle non réservée
function displaySalleNonReservee(numeroSalle, jourConsultation) {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('salleInexistante').style.display = 'none';
    document.getElementById('noReservation').style.display = 'block';
    
    document.getElementById('salleNonReservee').textContent = numeroSalle;
    document.getElementById('dateNonReservee').textContent = jourConsultation;
}

// Affichage salle inexistante
function displaySalleInexistante(numeroSalle) {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('noReservation').style.display = 'none';
    document.getElementById('salleInexistante').style.display = 'block';
    
    document.getElementById('salleErreur').textContent = numeroSalle;
}

// Gestion du loading
function setLoadingState(isLoading) {
    const button = document.querySelector('.search-button');
    const buttonText = document.querySelector('.button-text');
    
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

// Fonction principale de recherche
function rechercherPlanning() {
    console.log('Recherche planning...');
    
    const validation = validateSearchForm();
    if (!validation) return;
    
    setLoadingState(true);
    
    // Utiliser l'API publique
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
        if (!response.ok) {
            throw new Error('Erreur HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
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
        console.error('Erreur:', error);
        setLoadingState(false);
        showMessage('Erreur de connexion: ' + error.message, 'error');
    });
}

// Configuration du mode public
function setupModePublic() {
    console.log('Mode public activé');
    
    // Afficher info étudiant
    const infoEtudiant = document.getElementById('infoEtudiant');
    if (infoEtudiant) {
        infoEtudiant.style.display = 'block';
    }
    
    // Modifier en-tête
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.innerHTML = 
            '<div class="user-avatar-student"></div>' +
            '<span>Mode consultation étudiant</span>' +
            '<button onclick="allerSeConnecter()" style="' +
                'background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); ' +
                'color: white; padding: 8px 15px; border-radius: 5px; margin-left: 15px; ' +
                'cursor: pointer; font-size: 12px;">Se connecter</button>';
    }
    
    // Modifier bouton retour
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.onclick = function() { 
            window.location.href = '/authentif.html'; 
        };
        backButton.innerHTML = '← Retour à l\'accueil';
    }
    
    // Modifier titre
    const welcomeContent = document.querySelector('.welcome-content');
    if (welcomeContent) {
        welcomeContent.innerHTML = 
            '<h2>Consulter le planning des salles</h2>' +
            '<p>Consultez la disponibilité des salles en temps réel</p>';
    }
    
    // CSS pour avatar étudiant
    const style = document.createElement('style');
    style.textContent = 
        '.user-avatar-student { width: 32px; height: 32px; background-color: rgba(255, 255, 255, 0.2); ' +
        'border-radius: 50%; display: flex; align-items: center; justify-content: center; } ' +
        '.user-avatar-student::before { content: "👨‍🎓"; font-size: 16px; }';
    document.head.appendChild(style);
}

// Fonctions de navigation
function allerSeConnecter() {
    window.location.href = '/authentif.html';
}

function retourAccueil() {
    if (currentUser) {
        window.location.href = '/accueil.html';
    } else {
        window.location.href = '/authentif.html';
    }
}

function logout() {
    if (!currentUser) {
        window.location.href = '/authentif.html';
        return;
    }
    
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        window.location.href = '/';
    })
    .catch(function(error) {
        window.location.href = '/';
    });
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
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page planning chargée');
    
    // Vérifier authentification (optionnel)
    fetch('/api/auth/user-info')
        .then(function(response) {
            if (!response.ok) {
                setupModePublic();
                return null;
            }
            return response.json();
        })
        .then(function(data) {
            if (!data || !data.success) {
                setupModePublic();
            } else {
                // Mode enseignant
                currentUser = {
                    matricule: data.matricule,
                    nom: data.nom,
                    grade: data.grade
                };
                
                const userNameElement = document.querySelector('.user-info span');
                if (userNameElement) {
                    userNameElement.textContent = data.nom + ' (' + data.grade + ')';
                }
            }
        })
        .catch(function() {
            setupModePublic();
        });
    
    // Configuration
    setupDateFormatting();
    
    // Focus sur premier champ
    document.getElementById('numeroSalle').focus();
    
    console.log('Initialisation terminée');
});