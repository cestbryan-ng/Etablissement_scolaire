package com.example.test;

public class LoginResponse {
    private boolean success;
    private String message;
    private String matricule;
    private String nom;
    private String grade;

    // Constructeurs
    public LoginResponse() {}

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LoginResponse(boolean success, String message, String matricule, String nom, String grade) {
        this.success = success;
        this.message = message;
        this.matricule = matricule;
        this.nom = nom;
        this.grade = grade;
    }

    // Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}