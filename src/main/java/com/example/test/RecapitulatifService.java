package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecapitulatifService {

    @Autowired
    private ReservationSalleRepository reservationSalleRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public RecapitulatifResponse getRecapitulatif(RecapitulatifRequest request) {
        try {
            // Validation et conversion des dates
            LocalDate dateDebut = parseDate(request.getDateDebut());
            LocalDate dateFin = parseDate(request.getDateFin());

            if (dateDebut == null || dateFin == null) {
                return new RecapitulatifResponse(false, "Format de date invalide");
            }

            if (dateFin.isBefore(dateDebut)) {
                return new RecapitulatifResponse(false, "La date de fin doit être postérieure à la date de début");
            }

            // Récupération des réservations
            List<ReservationSalle> reservations = reservationSalleRepository
                    .findByMatriculeAndJourBetween(request.getMatricule(), dateDebut, dateFin);

            // Conversion en DTO
            List<ReservationDTO> reservationDTOs = reservations.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Calcul du total des heures
            int totalMinutes = reservations.stream()
                    .mapToInt(this::calculateDurationInMinutes)
                    .sum();

            String periode = request.getDateDebut() + " au " + request.getDateFin();

            RecapitulatifResponse response = new RecapitulatifResponse(
                    true,
                    "Récapitulatif généré avec succès",
                    reservationDTOs,
                    periode
            );

            response.setTotalHeures(formatDuration(totalMinutes));

            return response;

        } catch (Exception e) {
            return new RecapitulatifResponse(false, "Erreur lors de la génération du récapitulatif: " + e.getMessage());
        }
    }

    private LocalDate parseDate(String dateString) {
        try {
            return LocalDate.parse(dateString, dateFormatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private ReservationDTO convertToDTO(ReservationSalle reservation) {
        String jourFormatted = reservation.getJour().format(dateFormatter);
        String debutFormatted = reservation.getDebut().format(timeFormatter);
        String finFormatted = reservation.getFin().format(timeFormatter);

        ReservationDTO dto = new ReservationDTO(
                jourFormatted,
                reservation.getnSalle(),
                debutFormatted,
                finFormatted
        );

        int durationMinutes = calculateDurationInMinutes(reservation);
        dto.setDuree(formatDuration(durationMinutes));

        return dto;
    }

    private int calculateDurationInMinutes(ReservationSalle reservation) {
        Duration duration = Duration.between(reservation.getDebut(), reservation.getFin());
        return (int) duration.toMinutes();
    }

    private String formatDuration(int totalMinutes) {
        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;
        return String.format("%dh%02d", hours, minutes);
    }
}