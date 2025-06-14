package com.example.test;

public class PlanningRequest {
    private String numeroSalle;
    private String jourConsultation; // Format jj/mm/aaaa


    public PlanningRequest(String numeroSalle, String jourConsultation) {
        this.numeroSalle = numeroSalle;
        this.jourConsultation = jourConsultation;
    }

    // Getters et Setters
    public String getNumeroSalle() { return numeroSalle; }
    public void setNumeroSalle(String numeroSalle) { this.numeroSalle = numeroSalle; }

    public String getJourConsultation() { return jourConsultation; }
    public void setJourConsultation(String jourConsultation) { this.jourConsultation = jourConsultation; }
}
