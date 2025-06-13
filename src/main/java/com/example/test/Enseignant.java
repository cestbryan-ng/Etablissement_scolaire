package com.example.test;

import jakarta.persistence.*;

@Entity
@Table(name = "enseignant")
public class Enseignant {

    @Id
    @Column(name = "matricule")
    private String matricule;

    @Column(name = "cle_acces", nullable = false)
    private String cleAcces;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "grade")
    private String grade;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    // Constructeurs
    public Enseignant() {}

    public Enseignant(String matricule, String cleAcces, String nom, String grade, String email) {
        this.matricule = matricule;
        this.cleAcces = cleAcces;
        this.nom = nom;
        this.grade = grade;
        this.email = email;
    }

    // Getters et Setters
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getCleAcces() { return cleAcces; }
    public void setCleAcces(String cleAcces) { this.cleAcces = cleAcces; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
