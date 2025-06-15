package com.example.test;

import java.util.List;

public class ReservationMaterielResponse {
    private boolean success;
    private String message;
    private List<MaterielDisponibleDTO> materielsDisponibles;
    private String codeReservation; // En cas de réservation effectuée
    private String periode;          // Pour affichage
    private String salleReservee;    // Salle où le matériel sera déposé
    private List<String> codesReservation; // Pour réservations multiples

    // Constructeurs
    public ReservationMaterielResponse() {}

    public ReservationMaterielResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ReservationMaterielResponse(boolean success, String message,
                                       List<MaterielDisponibleDTO> materielsDisponibles,
                                       String periode) {
        this.success = success;
        this.message = message;
        this.materielsDisponibles = materielsDisponibles;
        this.periode = periode;
    }

    // Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<MaterielDisponibleDTO> getMaterielsDisponibles() { return materielsDisponibles; }
    public void setMaterielsDisponibles(List<MaterielDisponibleDTO> materielsDisponibles) {
        this.materielsDisponibles = materielsDisponibles;
    }

    public String getCodeReservation() { return codeReservation; }
    public void setCodeReservation(String codeReservation) { this.codeReservation = codeReservation; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public String getSalleReservee() { return salleReservee; }
    public void setSalleReservee(String salleReservee) { this.salleReservee = salleReservee; }

    public List<String> getCodesReservation() { return codesReservation; }
    public void setCodesReservation(List<String> codesReservation) { this.codesReservation = codesReservation; }
}