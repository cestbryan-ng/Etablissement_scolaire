package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/planning")
@CrossOrigin(origins = "*")
public class PlanningPublicController {

    @Autowired
    private PlanningSalleService planningSalleService;

    @PostMapping("/salle")
    public ResponseEntity<PlanningResponse> consulterPlanningSallePublic(
            @RequestBody PlanningRequest request) {

        try {
            // Validation des paramètres
            if (request.getNumeroSalle() == null || request.getNumeroSalle().trim().isEmpty()) {
                return ResponseEntity.ok(new PlanningResponse(false, "Numéro de salle requis"));
            }

            if (request.getJourConsultation() == null || request.getJourConsultation().trim().isEmpty()) {
                return ResponseEntity.ok(new PlanningResponse(false, "Jour de consultation requis"));
            }

            // ENDPOINT PUBLIC - Aucune vérification de session requise
            System.out.println("🌍 Accès public au planning - Salle: " + request.getNumeroSalle() + ", Date: " + request.getJourConsultation());

            // Appeler le service
            PlanningResponse response = planningSalleService.consulterPlanningSalle(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Erreur dans l'endpoint public: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new PlanningResponse(false, "Erreur serveur: " + e.getMessage()));
        }
    }

    // Endpoint pour vérifier si l'API publique fonctionne
    @GetMapping("/test")
    public ResponseEntity<String> testPublic() {
        return ResponseEntity.ok("✅ API publique accessible - Planning disponible pour consultation");
    }
}