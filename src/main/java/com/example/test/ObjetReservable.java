package com.example.test;

import jakarta.persistence.*;

@Entity
@Table(name = "objetreservable")
public class ObjetReservable {

    @Id
    @Column(name = "id_objet")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idObjet;

    @Column(name = "disponible")
    private Boolean disponible;

    @Column(name = "type")
    private String type;

    // Constructeurs
    public ObjetReservable() {}

    public ObjetReservable(Boolean disponible, String type) {
        this.disponible = disponible;
        this.type = type;
    }

    // Getters et Setters
    public Integer getIdObjet() { return idObjet; }
    public void setIdObjet(Integer idObjet) { this.idObjet = idObjet; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}