package com.example.test;

public class MaterielDisponibleDTO {
    private String typeMateriel;
    private Integer quantiteDisponible;
    private Integer quantiteTotal;

    // Constructeurs
    public MaterielDisponibleDTO() {}

    public MaterielDisponibleDTO(String typeMateriel, Integer quantiteDisponible, Integer quantiteTotal) {
        this.typeMateriel = typeMateriel;
        this.quantiteDisponible = quantiteDisponible;
        this.quantiteTotal = quantiteTotal;
    }

    // Getters et Setters
    public String getTypeMateriel() { return typeMateriel; }
    public void setTypeMateriel(String typeMateriel) { this.typeMateriel = typeMateriel; }

    public Integer getQuantiteDisponible() { return quantiteDisponible; }
    public void setQuantiteDisponible(Integer quantiteDisponible) { this.quantiteDisponible = quantiteDisponible; }

    public Integer getQuantiteTotal() { return quantiteTotal; }
    public void setQuantiteTotal(Integer quantiteTotal) { this.quantiteTotal = quantiteTotal; }
}