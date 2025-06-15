package com.example.test;

import java.util.List;

public class ReservationSalleResponse {
    private boolean success;
    private String message;
    private List<SalleDisponibleDTO> sallesDisponibles;
    private String codeReservation; // En cas de réservation effectuée
    private String periode;          // Pour affichage
    private Integer nombrePlacesRequises;

    // Constructeurs
    public ReservationSalleResponse() {}

    public ReservationSalleResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ReservationSalleResponse(boolean success, String message,
                                    List<SalleDisponibleDTO> sallesDisponibles,
                                    String periode, Integer nombrePlacesRequises) {
        this.success = success;
        this.message = message;
        this.sallesDisponibles = sallesDisponibles;
        this.periode = periode;
        this.nombrePlacesRequises = nombrePlacesRequises;
    }

    // Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<SalleDisponibleDTO> getSallesDisponibles() { return sallesDisponibles; }
    public void setSallesDisponibles(List<SalleDisponibleDTO> sallesDisponibles) {
        this.sallesDisponibles = sallesDisponibles;
    }

    public String getCodeReservation() { return codeReservation; }
    public void setCodeReservation(String codeReservation) { this.codeReservation = codeReservation; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public Integer getNombrePlacesRequises() { return nombrePlacesRequises; }
    public void setNombrePlacesRequises(Integer nombrePlacesRequises) {
        this.nombrePlacesRequises = nombrePlacesRequises;
    }
}