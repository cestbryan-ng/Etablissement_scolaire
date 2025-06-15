package com.example.test;

public class ReservationMaterielRequest {
    private String matricule;
    private String date;           // Format jj/mm/aaaa
    private String heureDebut;     // Format HH:mm
    private String heureFin;       // Format HH:mm
    private String typeMateriel;   // "Ordinateur" ou "Video_Projecteur"
    private Integer quantite;      // Nombre d'objets souhaités

    // Constructeurs
    public ReservationMaterielRequest() {}

    public ReservationMaterielRequest(String matricule, String date, String heureDebut,
                                      String heureFin, String typeMateriel, Integer quantite) {
        this.matricule = matricule;
        this.date = date;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.typeMateriel = typeMateriel;
        this.quantite = quantite;
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

    public String getTypeMateriel() { return typeMateriel; }
    public void setTypeMateriel(String typeMateriel) { this.typeMateriel = typeMateriel; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }
}