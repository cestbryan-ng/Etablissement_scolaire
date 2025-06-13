package com.example.test;

public class RecapitulatifRequest {
    private String matricule;
    private String dateDebut; // Format jj/mm/aaaa
    private String dateFin;   // Format jj/mm/aaaa

    // Constructeurs
    public RecapitulatifRequest() {}

    public RecapitulatifRequest(String matricule, String dateDebut, String dateFin) {
        this.matricule = matricule;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }

    // Getters et Setters
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }

    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }
}
