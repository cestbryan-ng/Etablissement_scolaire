package com.example.test;

import jakarta.persistence.*;

@Entity
@Table(name = "salle")
public class Salle {

    @Id
    @Column(name = "n_salle")
    private String nSalle;

    @Column(name = "capacite")
    private Integer capacite;

    @Column(name = "disponible")
    private Boolean disponible;

    // Constructeurs
    public Salle() {}

    public Salle(String nSalle, Integer capacite, Boolean disponible) {
        this.nSalle = nSalle;
        this.capacite = capacite;
        this.disponible = disponible;
    }

    // Getters et Setters
    public String getnSalle() { return nSalle; }
    public void setnSalle(String nSalle) { this.nSalle = nSalle; }

    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
}
