package com.example.test;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservationobjet")
public class ReservationObjet {

    @Id
    @Column(name = "code_reservation")
    private String codeReservation;

    @Column(name = "jour")
    private LocalDate jour;

    @Column(name = "debut")
    private LocalTime debut;

    @Column(name = "fin")
    private LocalTime fin;

    @Column(name = "matricule")
    private String matricule;

    @Column(name = "id_objet")
    private Integer idObjet;

    // Constructeurs
    public ReservationObjet() {}

    public ReservationObjet(String codeReservation, LocalDate jour, LocalTime debut,
                            LocalTime fin, String matricule, Integer idObjet) {
        this.codeReservation = codeReservation;
        this.jour = jour;
        this.debut = debut;
        this.fin = fin;
        this.matricule = matricule;
        this.idObjet = idObjet;
    }

    // Getters et Setters
    public String getCodeReservation() { return codeReservation; }
    public void setCodeReservation(String codeReservation) { this.codeReservation = codeReservation; }

    public LocalDate getJour() { return jour; }
    public void setJour(LocalDate jour) { this.jour = jour; }

    public LocalTime getDebut() { return debut; }
    public void setDebut(LocalTime debut) { this.debut = debut; }

    public LocalTime getFin() { return fin; }
    public void setFin(LocalTime fin) { this.fin = fin; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public Integer getIdObjet() { return idObjet; }
    public void setIdObjet(Integer idObjet) { this.idObjet = idObjet; }
}