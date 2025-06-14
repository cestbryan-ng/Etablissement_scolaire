package com.example.test;

import java.util.List;

public class PlanningResponse {
    private boolean success;
    private String message;
    private boolean salleExiste;
    private String numeroSalle;
    private String jourConsultation;
    private List<PlanningReservationDTO> reservations;

    // Constructeurs
    public PlanningResponse() {
    }

    public PlanningResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public PlanningResponse(boolean success, String message, boolean salleExiste,
                            String numeroSalle, String jourConsultation,
                            List<PlanningReservationDTO> reservations) {
        this.success = success;
        this.message = message;
        this.salleExiste = salleExiste;
        this.numeroSalle = numeroSalle;
        this.jourConsultation = jourConsultation;
        this.reservations = reservations;
    }

    // Getters et Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSalleExiste() {
        return salleExiste;
    }

    public void setSalleExiste(boolean salleExiste) {
        this.salleExiste = salleExiste;
    }

    public String getNumeroSalle() {
        return numeroSalle;
    }

    public void setNumeroSalle(String numeroSalle) {
        this.numeroSalle = numeroSalle;
    }

    public String getJourConsultation() {
        return jourConsultation;
    }

    public void setJourConsultation(String jourConsultation) {
        this.jourConsultation = jourConsultation;
    }

    public List<PlanningReservationDTO> getReservations() {
        return reservations;
    }

    public void setReservations(List<PlanningReservationDTO> reservations) {
        this.reservations = reservations;
    }
}
