package com.example.test;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;

@Controller
public class PageController {

    @GetMapping("/")
    public String loginPage() {
        return "redirect:/authentif.html"; // retourne authentif.html
    }

    @GetMapping("/accueil")
    public String accueilPage(HttpSession session, Model model) {
        Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");

        if (isLoggedIn != null && isLoggedIn) {
            // Ajouter les infos utilisateur au modèle
            model.addAttribute("nomEnseignant", session.getAttribute("nom"));
            model.addAttribute("gradeEnseignant", session.getAttribute("grade"));
            model.addAttribute("matricule", session.getAttribute("matricule"));
            return "redirect:/accueil.html"; // retourne accueil.html
        } else {
            return "redirect:/"; // redirection vers la page de connexion
        }
    }
}