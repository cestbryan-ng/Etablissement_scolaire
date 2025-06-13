package com.example.test;

public class ReservationDTO {
    private String jour;      // Format jj/mm/aaaa pour le frontend
    private String nSalle;
    private String debut;     // Format HH:mm
    private String fin;       // Format HH:mm
    private String duree;     // Format Xh Ym calculé

    // Constructeurs
    public ReservationDTO() {}

    public ReservationDTO(String jour, String nSalle, String debut, String fin) {
        this.jour = jour;
        this.nSalle = nSalle;
        this.debut = debut;
        this.fin = fin;
    }

    // Getters et Setters
    public String getJour() { return jour; }
    public void setJour(String jour) { this.jour = jour; }

    public String getnSalle() { return nSalle; }
    public void setnSalle(String nSalle) { this.nSalle = nSalle; }

    public String getDebut() { return debut; }
    public void setDebut(String debut) { this.debut = debut; }

    public String getFin() { return fin; }
    public void setFin(String fin) { this.fin = fin; }

    public String getDuree() { return duree; }
    public void setDuree(String duree) { this.duree = duree; }
}
