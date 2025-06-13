package com.example.test;

import java.util.List;

public class RecapitulatifResponse {
    private boolean success;
    private String message;
    private List<ReservationDTO> reservations;
    private String periode;
    private int totalReservations;
    private String totalHeures;

    // Constructeurs
    public RecapitulatifResponse() {}

    public RecapitulatifResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public RecapitulatifResponse(boolean success, String message,
                                 List<ReservationDTO> reservations, String periode) {
        this.success = success;
        this.message = message;
        this.reservations = reservations;
        this.periode = periode;
        this.totalReservations = reservations != null ? reservations.size() : 0;
    }

    // Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<ReservationDTO> getReservations() { return reservations; }
    public void setReservations(List<ReservationDTO> reservations) {
        this.reservations = reservations;
        this.totalReservations = reservations != null ? reservations.size() : 0;
    }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public int getTotalReservations() { return totalReservations; }
    public void setTotalReservations(int totalReservations) { this.totalReservations = totalReservations; }

    public String getTotalHeures() { return totalHeures; }
    public void setTotalHeures(String totalHeures) { this.totalHeures = totalHeures; }
}
