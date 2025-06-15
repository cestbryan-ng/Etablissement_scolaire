package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest,
                                               HttpSession session) {
        try {
            Optional<Enseignant> enseignant = authService.authenticate(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );

            if (enseignant.isPresent()) {
                Enseignant ens = enseignant.get();

                // Stocker les informations dans la session
                session.setAttribute("matricule", ens.getMatricule());
                session.setAttribute("nom", ens.getNom());
                session.setAttribute("grade", ens.getGrade());
                session.setAttribute("email", ens.getEmail());
                session.setAttribute("isLoggedIn", true);

                return ResponseEntity.ok(new LoginResponse(
                        true,
                        "Connexion réussie",
                        ens.getMatricule(),
                        ens.getNom(),
                        ens.getGrade()
                ));
            } else {
                return ResponseEntity.ok(new LoginResponse(false, "Identifiants incorrects"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new LoginResponse(false, "Erreur serveur"));
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<LoginResponse> getUserInfo(HttpSession session) {
        try {
            Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");

            if (isLoggedIn != null && isLoggedIn) {
                return ResponseEntity.ok(new LoginResponse(
                        true,
                        "Utilisateur connecté",
                        (String) session.getAttribute("matricule"),
                        (String) session.getAttribute("nom"),
                        (String) session.getAttribute("grade")
                ));
            } else {
                // ACCÈS PUBLIC : Retourner success=false sans erreur HTTP
                return ResponseEntity.ok(new LoginResponse(false, "Utilisateur non connecté"));
            }
        } catch (Exception e) {
            // En cas d'erreur, considérer comme non connecté (accès public)
            return ResponseEntity.ok(new LoginResponse(false, "Session non disponible"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(new LoginResponse(true, "Déconnexion réussie"));
    }
}
