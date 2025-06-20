package com.example.test;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/planning")
@CrossOrigin(origins = "*")
public class PlanningSalleController {

    @Autowired
    private PlanningSalleService planningSalleService;

    @PostMapping("/salle")
    public ResponseEntity<PlanningResponse> consulterPlanningSalle(
            @RequestBody PlanningRequest request,
            HttpSession session) {

        try {
            // Validation des paramètres
            if (request.getNumeroSalle() == null || request.getNumeroSalle().trim().isEmpty()) {
                return ResponseEntity.ok(new PlanningResponse(false, "Numéro de salle requis"));
            }

            if (request.getJourConsultation() == null || request.getJourConsultation().trim().isEmpty()) {
                return ResponseEntity.ok(new PlanningResponse(false, "Jour de consultation requis"));
            }

            // ACCÈS PUBLIC AUTORISÉ - Pas de vérification de session
            // Cette fonctionnalité est accessible aux étudiants sans connexion

            // Appeler le service
            PlanningResponse response = planningSalleService.consulterPlanningSalle(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(new PlanningResponse(false, "Erreur serveur: " + e.getMessage()));
        }
    }
}


