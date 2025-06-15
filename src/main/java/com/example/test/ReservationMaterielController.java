package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/materiel")
@CrossOrigin(origins = "*")
public class ReservationMaterielController {

    @Autowired
    private ReservationMaterielService reservationMaterielService;

    @PostMapping("/consulter-disponibilite")
    public ResponseEntity<ReservationMaterielResponse> consulterDisponibilite(
            @RequestBody ReservationMaterielRequest request,
            HttpSession session) {

        try {
            // Vérifier la session
            Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
            String matriculeSession = (String) session.getAttribute("matricule");

            if (isLoggedIn == null || !isLoggedIn) {
                return ResponseEntity.ok(new ReservationMaterielResponse(false, "Session expirée"));
            }

            // Validation des paramètres
            if (request.getDate() == null || request.getDate().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationMaterielResponse(false, "Date requise"));
            }

            if (request.getHeureDebut() == null || request.getHeureDebut().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationMaterielResponse(false, "Heure de début requise"));
            }

            if (request.getHeureFin() == null || request.getHeureFin().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationMaterielResponse(false, "Heure de fin requise"));
            }

            // Utiliser le matricule de la session
            request.setMatricule(matriculeSession);

            // Appeler le service
            ReservationMaterielResponse response = reservationMaterielService.consulterDisponibilite(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(new ReservationMaterielResponse(false, "Erreur serveur: " + e.getMessage()));
        }
    }

    @PostMapping("/confirmer")
    public ResponseEntity<ReservationMaterielResponse> confirmerReservation(
            @RequestBody ConfirmationMaterielRequest request,
            HttpSession session) {

        try {
            // Vérifier la session
            Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
            String matriculeSession = (String) session.getAttribute("matricule");

            if (isLoggedIn == null || !isLoggedIn) {
                return ResponseEntity.ok(new ReservationMaterielResponse(false, "Session expirée"));
            }

            // Validation des paramètres
            if (request.getTypeMateriel() == null || request.getTypeMateriel().trim().isEmpty()) {
                return ResponseEntity.ok(new ReservationMaterielResponse(false, "Type de matériel requis"));
            }

            if (request.getQuantite() == null || request.getQuantite() <= 0) {
                return ResponseEntity.ok(new ReservationMaterielResponse(false, "Quantité invalide"));
            }

            // Appeler le service
            ReservationMaterielResponse response = reservationMaterielService.confirmerReservation(
                    matriculeSession,
                    request.getTypeMateriel(),
                    request.getQuantite(),
                    request.getDate(),
                    request.getHeureDebut(),
                    request.getHeureFin()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(new ReservationMaterielResponse(false, "Erreur serveur: " + e.getMessage()));
        }
    }

    // Classe interne pour la confirmation
    public static class ConfirmationMaterielRequest {
        private String typeMateriel;
        private Integer quantite;
        private String date;
        private String heureDebut;
        private String heureFin;

        // Constructeurs
        public ConfirmationMaterielRequest() {}

        // Getters et Setters
        public String getTypeMateriel() { return typeMateriel; }
        public void setTypeMateriel(String typeMateriel) { this.typeMateriel = typeMateriel; }

        public Integer getQuantite() { return quantite; }
        public void setQuantite(Integer quantite) { this.quantite = quantite; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getHeureDebut() { return heureDebut; }
        public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

        public String getHeureFin() { return heureFin; }
        public void setHeureFin(String heureFin) { this.heureFin = heureFin; }
    }
}