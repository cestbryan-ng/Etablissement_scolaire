package com.example.test;

public class SalleDisponibleDTO {
    private String numeroSalle;  // Nom plus standard
    private Integer capacite;
    private String statut;

    // Constructeurs
    public SalleDisponibleDTO() {}

    public SalleDisponibleDTO(String numeroSalle, Integer capacite, String statut) {
        this.numeroSalle = numeroSalle;
        this.capacite = capacite;
        this.statut = statut;
    }

    // Getters et Setters avec convention JavaBean standard
    public String getNumeroSalle() { return numeroSalle; }
    public void setNumeroSalle(String numeroSalle) { this.numeroSalle = numeroSalle; }

    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}