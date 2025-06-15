package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/reservation")
@CrossOrigin(origins = "*")
public class ReservationSalleController {

    @Autowired
    private ReservationSalleService reservationSalleService;

    @PostMapping("/rechercher-salles")
    public ResponseEntity<ReservationSalleResponse> rechercherSallesDisponibles(
            @RequestBody ReservationSalleRequest request,
            HttpSession session) {

        try {
            // Vérifier la session
            Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
            String matriculeSession = (String) session.getAttribute("matricule");

            if (isLoggedIn == null || !isLoggedIn) {
                return ResponseEntity.ok(new ReservationSalleResponse(false, "Session expirée"));
            }

            // Validation des paramètres
            if (request.getDate() == null || request.getDate().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationSalleResponse(false, "Date requise"));
            }

            if (request.getHeureDebut() == null || request.getHeureDebut().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationSalleResponse(false, "Heure de début requise"));
            }

            if (request.getHeureFin() == null || request.getHeureFin().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationSalleResponse(false, "Heure de fin requise"));
            }

            if (request.getNombrePlacesMin() == null || request.getNombrePlacesMin() <= 0) {
                return ResponseEntity.ok(new ReservationSalleResponse(false, "Nombre de places invalide"));
            }

            // Utiliser le matricule de la session
            request.setMatricule(matriculeSession);

            // Appeler le service
            ReservationSalleResponse response = reservationSalleService.rechercherSallesDisponibles(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(new ReservationSalleResponse(false, "Erreur serveur: " + e.getMessage()));
        }
    }

    @PostMapping("/confirmer")
    public ResponseEntity<ReservationSalleResponse> confirmerReservation(
            @RequestBody ConfirmationReservationRequest request,
            HttpSession session) {

        try {
            // Vérifier la session
            Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
            String matriculeSession = (String) session.getAttribute("matricule");

            if (isLoggedIn == null || !isLoggedIn) {
                return ResponseEntity.ok(new ReservationSalleResponse(false, "Session expirée"));
            }

            // Validation des paramètres
            if (request.getNumeroSalle() == null || request.getNumeroSalle().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationSalleResponse(false, "Salle requise"));
            }

            // Appeler le service
            ReservationSalleResponse response = reservationSalleService.confirmerReservation(
                    matriculeSession,
                    request.getNumeroSalle(),
                    request.getDate(),
                    request.getHeureDebut(),
                    request.getHeureFin()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(new ReservationSalleResponse(false, "Erreur serveur: " + e.getMessage()));
        }
    }

    // Classe interne pour la confirmation
    public static class ConfirmationReservationRequest {
        private String numeroSalle;  // Changé de nSalle à numeroSalle
        private String date;
        private String heureDebut;
        private String heureFin;

        // Constructeurs
        public ConfirmationReservationRequest() {}

        // Getters et Setters
        public String getNumeroSalle() { return numeroSalle; }
        public void setNumeroSalle(String numeroSalle) { this.numeroSalle = numeroSalle; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getHeureDebut() { return heureDebut; }
        public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

        public String getHeureFin() { return heureFin; }
        public void setHeureFin(String heureFin) { this.heureFin = heureFin; }
    }
}