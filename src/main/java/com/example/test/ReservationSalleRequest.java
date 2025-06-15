package com.example.test;

public class ReservationSalleRequest {
    private String matricule;
    private String date;           // Format jj/mm/aaaa
    private String heureDebut;     // Format HH:mm
    private String heureFin;       // Format HH:mm
    private Integer nombrePlacesMin;

    // Constructeurs
    public ReservationSalleRequest() {}

    public ReservationSalleRequest(String matricule, String date, String heureDebut,
                                   String heureFin, Integer nombrePlacesMin) {
        this.matricule = matricule;
        this.date = date;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.nombrePlacesMin = nombrePlacesMin;
    }

    // Getters et Setters
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getHeureDebut() { return heureDebut; }
    public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

    public String getHeureFin() { return heureFin; }
    public void setHeureFin(String heureFin) { this.heureFin = heureFin; }

    public Integer getNombrePlacesMin() { return nombrePlacesMin; }
    public void setNombrePlacesMin(Integer nombrePlacesMin) { this.nombrePlacesMin = nombrePlacesMin; }
}