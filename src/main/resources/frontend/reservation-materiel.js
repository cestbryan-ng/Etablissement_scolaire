// Script pour la réservation de matériel

// Variables globales
let currentUser = null;
let currentPeriode = null;
let materielSelectionne = null;

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

// Validation complète du formulaire de consultation
function validateConsultationForm() {
    const dateInput = document.getElementById('dateReservation');
    const heureDebutInput = document.getElementById('heureDebut');
    const heureFinInput = document.getElementById('heureFin');
    
    const date = dateInput.value.trim();
    const heureDebut = heureDebutInput.value.trim();
    const heureFin = heureFinInput.value.trim();
    
    // Réinitialiser les styles d'erreur
    [dateInput, heureDebutInput, heureFinInput].forEach(input => {
        input.classList.remove('error');
    });
    
    // Vérifier que les champs ne sont pas vides
    if (!date || !heureDebut || !heureFin) {
        showMessage('Veuillez remplir tous les champs', 'error');
        if (!date) dateInput.classList.add('error');
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
        heureDebut: heureDebut,
        heureFin: heureFin
    };
}

// Consulter la disponibilité du matériel
function consulterDisponibilite() {
    console.log('=== CONSULTATION DISPONIBILITÉ MATÉRIEL ===');
    
    // Valider le formulaire
    const validation = validateConsultationForm();
    if (!validation) {
        return;
    }
    
    // Afficher le loading
    setLoadingState('consultation', true);
    
    // Stocker la période
    currentPeriode = validation;
    
    console.log('Période de consultation:', currentPeriode);
    
    // Appel à l'API
    fetch('/api/materiel/consulter-disponibilite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            date: validation.date,
            heureDebut: validation.heureDebut,
            heureFin: validation.heureFin
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
        setLoadingState('consultation', false);
        
        if (data.success) {
            if (data.materielsDisponibles && data.materielsDisponibles.length > 0) {
                afficherMaterielsDisponibles(data.materielsDisponibles, data.periode);
            } else {
                afficherAucunMateriel(data.message);
            }
        } else {
            if (data.message && data.message.includes('réserver une salle')) {
                afficherPasDeSalle();
            } else {
                showMessage(data.message || 'Erreur lors de la consultation', 'error');
            }
        }
    })
    .catch(function(error) {
        console.error('Erreur:', error);
        setLoadingState('consultation', false);
        showMessage('Erreur de connexion à l\'API: ' + error.message, 'error');
    });
}

// Afficher les matériels disponibles
function afficherMaterielsDisponibles(materiels, periode) {
    console.log('Affichage des matériels:', materiels);
    
    // Masquer les autres sections
    masquerToutesLesEtapes();
    
    // Afficher l'étape 2
    document.getElementById('step2').style.display = 'block';
    
    // Mettre à jour le texte d'information
    document.getElementById('periodeInfo').textContent = 
        'Période : ' + periode + ' - Matériel disponible';
    
    // Générer les cartes de matériel
    const materielGrid = document.getElementById('materielGrid');
    materielGrid.innerHTML = '';
    
    materiels.forEach(function(materiel) {
        const materielCard = document.createElement('div');
        materielCard.className = 'materiel-card';
        materielCard.onclick = function() { selectionnerMateriel(materiel, materielCard); };
        
        // Icône selon le type
        let icone = '📦';
        if (materiel.typeMateriel === 'Ordinateur') {
            icone = '💻';
        } else if (materiel.typeMateriel === 'Video_Projecteur') {
            icone = '📽️';
        }
        
        // Nom affiché
        let nomAffiche = materiel.typeMateriel.replace('_', ' ');
        if (nomAffiche === 'Video Projecteur') {
            nomAffiche = 'Vidéoprojecteur';
        }
        
        materielCard.innerHTML = 
            '<div class="materiel-icon">' + icone + '</div>' +
            '<div class="materiel-name">' + nomAffiche + '</div>' +
            '<div class="materiel-disponibilite">' + 
                materiel.quantiteDisponible + ' disponible(s) sur ' + materiel.quantiteTotal + 
            '</div>' +
            '<div class="quantite-selector">' +
                '<label>Quantité souhaitée :</label>' +
                '<input type="number" min="1" max="' + materiel.quantiteDisponible + 
                '" value="1" onchange="updateQuantite(this)" onclick="event.stopPropagation()">' +
            '</div>';
        
        materielGrid.appendChild(materielCard);
    });
    
    // Réinitialiser la sélection
    materielSelectionne = null;
}

// Sélectionner un matériel
function selectionnerMateriel(materiel, cardElement) {
    console.log('Matériel sélectionné:', materiel);
    
    // Désélectionner les autres cartes
    document.querySelectorAll('.materiel-card').forEach(function(card) {
        card.classList.remove('selected');
    });
    
    // Sélectionner cette carte
    cardElement.classList.add('selected');
    
    // Récupérer la quantité saisie
    const quantiteInput = cardElement.querySelector('input[type="number"]');
    const quantite = parseInt(quantiteInput.value) || 1;
    
    // Stocker le matériel sélectionné avec la quantité
    materielSelectionne = {
        typeMateriel: materiel.typeMateriel,
        nomAffiche: materiel.typeMateriel.replace('_', ' ').replace('Video Projecteur', 'Vidéoprojecteur'),
        quantiteDisponible: materiel.quantiteDisponible,
        quantiteSelectionnee: quantite
    };
    
    // Afficher la confirmation après un délai
    setTimeout(function() {
        afficherConfirmation();
    }, 300);
}

// Mettre à jour la quantité sélectionnée
function updateQuantite(input) {
    const quantite = parseInt(input.value) || 1;
    const card = input.closest('.materiel-card');
    
    if (card.classList.contains('selected') && materielSelectionne) {
        materielSelectionne.quantiteSelectionnee = quantite;
    }
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
        '    <span class="detail-label">Matériel :</span>' +
        '    <span class="detail-value">' + materielSelectionne.nomAffiche + '</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Quantité :</span>' +
        '    <span class="detail-value">' + materielSelectionne.quantiteSelectionnee + '</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Date :</span>' +
        '    <span class="detail-value">' + currentPeriode.date + '</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Horaire :</span>' +
        '    <span class="detail-value">' + currentPeriode.heureDebut + ' - ' + currentPeriode.heureFin + '</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Durée :</span>' +
        '    <span class="detail-value">' + calculerDuree(currentPeriode.heureDebut, currentPeriode.heureFin) + '</span>' +
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
    console.log('=== CONFIRMATION RÉSERVATION MATÉRIEL ===');
    
    if (!materielSelectionne || !currentPeriode) {
        showMessage('Erreur: données manquantes', 'error');
        return;
    }
    
    // Afficher le loading
    setLoadingState('confirmation', true);
    
    console.log('Confirmation réservation pour:', materielSelectionne);
    
    // Appel à l'API
    fetch('/api/materiel/confirmer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            typeMateriel: materielSelectionne.typeMateriel,
            quantite: materielSelectionne.quantiteSelectionnee,
            date: currentPeriode.date,
            heureDebut: currentPeriode.heureDebut,
            heureFin: currentPeriode.heureFin
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
        setLoadingState('confirmation', false);
        
        if (data.success) {
            afficherSucces(data);
            showMessage('Réservation confirmée avec succès !', 'success');
        } else {
            showMessage(data.message || 'Erreur lors de la confirmation', 'error');
        }
    })
    .catch(function(error) {
        console.error('Erreur:', error);
        setLoadingState('confirmation', false);
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
    let codesAffichage = '';
    if (data.codesReservation && data.codesReservation.length > 0) {
        if (data.codesReservation.length === 1) {
            codesAffichage = '<strong>' + data.codesReservation[0] + '</strong>';
        } else {
            codesAffichage = data.codesReservation.map(code => '<strong>' + code + '</strong>').join(', ');
        }
    }
    
    const successDetails = document.getElementById('successDetails');
    successDetails.innerHTML = 
        '<div class="detail-row">' +
        '    <span class="detail-label">Code(s) de réservation :</span>' +
        '    <span class="detail-value">' + codesAffichage + '</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Matériel :</span>' +
        '    <span class="detail-value">' + materielSelectionne.nomAffiche + ' (x' + materielSelectionne.quantiteSelectionnee + ')</span>' +
        '</div>' +
        '<div class="detail-row">' +
        '    <span class="detail-label">Période :</span>' +
        '    <span class="detail-value">' + data.periode + '</span>' +
        '</div>' +
        (data.salleReservee ? 
        '<div class="detail-row">' +
        '    <span class="detail-label">Livraison en salle :</span>' +
        '    <span class="detail-value">' + data.salleReservee + '</span>' +
        '</div>' : '');
}

// Afficher "Pas de salle réservée"
function afficherPasDeSalle() {
    console.log('Pas de salle réservée pour cette période');
    
    // Masquer les autres sections
    masquerToutesLesEtapes();
    
    // Afficher la section pas de salle
    document.getElementById('pasDeSalle').style.display = 'block';
}

// Afficher "Aucun matériel disponible"
function afficherAucunMateriel(message) {
    console.log('Aucun matériel disponible:', message);
    
    // Masquer les autres sections
    masquerToutesLesEtapes();
    
    // Afficher la section aucun matériel
    document.getElementById('aucunMateriel').style.display = 'block';
    document.getElementById('aucunMaterielMessage').textContent = message;
}

// Masquer toutes les étapes
function masquerToutesLesEtapes() {
    ['step1', 'step2', 'step3', 'success', 'pasDeSalle', 'aucunMateriel'].forEach(function(id) {
        document.getElementById(id).style.display = 'none';
    });
}

// Navigation entre les étapes
function retourConsultation() {
    masquerToutesLesEtapes();
    document.getElementById('step1').style.display = 'block';
    materielSelectionne = null;
    currentPeriode = null;
}

function retourSelection() {
    masquerToutesLesEtapes();
    document.getElementById('step2').style.display = 'block';
}

function nouvelleReservation() {
    // Réinitialiser les données
    currentPeriode = null;
    materielSelectionne = null;
    
    // Vider les champs
    document.getElementById('dateReservation').value = '';
    document.getElementById('heureDebut').value = '';
    document.getElementById('heureFin').value = '';
    
    // Retour à l'étape 1
    retourConsultation();
}

function allerReserverSalle() {
    window.location.href = '/reservation-salle.html';
}

// Gestion de l'état de chargement
function setLoadingState(type, isLoading) {
    let button, buttonText, spinner;
    
    if (type === 'consultation') {
        button = document.querySelector('.search-button');
        buttonText = button.querySelector('.button-text');
        spinner = document.getElementById('loadingSpinner1');
    } else if (type === 'confirmation') {
        button = document.querySelector('.confirm-button');
        buttonText = button.querySelector('.button-text');
        spinner = document.getElementById('loadingSpinner3');
    }
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        if (type === 'consultation') {
            buttonText.textContent = 'Consultation...';
        } else {
            buttonText.textContent = 'Confirmation...';
        }
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        if (type === 'consultation') {
            buttonText.textContent = 'Consulter la disponibilité';
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
    ['dateReservation', 'heureDebut', 'heureFin'].forEach(function(id) {
        document.getElementById(id).addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PAGE RÉSERVATION MATÉRIEL CHARGÉE ===');
    
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