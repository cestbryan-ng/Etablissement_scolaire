package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class RecapitulatifController {

    @Autowired
    private RecapitulatifService recapitulatifService;

    @PostMapping("/recapitulatif")
    public ResponseEntity<RecapitulatifResponse> getRecapitulatif(
            @RequestBody RecapitulatifRequest request,
            HttpSession session) {

        try {
            // Vérifier la session
            Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
            String matriculeSession = (String) session.getAttribute("matricule");

            if (isLoggedIn == null || !isLoggedIn) {
                return ResponseEntity.ok(new RecapitulatifResponse(false, "Session expirée"));
            }

            // Vérifier que le matricule correspond à la session
            if (!matriculeSession.equals(request.getMatricule())) {
                return ResponseEntity.ok(new RecapitulatifResponse(false, "Accès non autorisé"));
            }

            // Appeler le service
            RecapitulatifResponse response = recapitulatifService.getRecapitulatif(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(new RecapitulatifResponse(false, "Erreur serveur: " + e.getMessage()));
        }
    }
}