package com.example.test;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlanningSalleService {

    @Autowired
    private ReservationSalleRepository reservationSalleRepository;

    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public PlanningResponse consulterPlanningSalle(PlanningRequest request) {
        try {
            // Validation et conversion de la date
            LocalDate dateJour = parseDate(request.getJourConsultation());
            if (dateJour == null) {
                return new PlanningResponse(false, "Format de date invalide");
            }

            // Vérification de l'existence de la salle
            String numeroSalle = request.getNumeroSalle().toUpperCase();
            boolean salleExiste = salleRepository.existsByNSalle(numeroSalle);

            if (!salleExiste) {
                // Salle inexistante
                return new PlanningResponse(
                        true,
                        "Salle inexistante",
                        false,
                        numeroSalle,
                        request.getJourConsultation(),
                        null
                );
            }

            // Récupération des réservations pour cette salle et ce jour
            List<ReservationSalle> reservations = reservationSalleRepository
                    .findByNSalleAndJour(numeroSalle, dateJour);

            // Conversion en DTO avec informations enseignant
            List<PlanningReservationDTO> reservationDTOs = reservations.stream()
                    .map(this::convertToReservationDTO)
                    .collect(Collectors.toList());

            return new PlanningResponse(
                    true,
                    "Planning récupéré avec succès",
                    true,
                    numeroSalle,
                    request.getJourConsultation(),
                    reservationDTOs
            );

        } catch (Exception e) {
            return new PlanningResponse(false, "Erreur lors de la consultation du planning: " + e.getMessage());
        }
    }

    private LocalDate parseDate(String dateString) {
        try {
            return LocalDate.parse(dateString, dateFormatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private PlanningReservationDTO convertToReservationDTO(ReservationSalle reservation) {
        String debutFormatted = reservation.getDebut().format(timeFormatter);
        String finFormatted = reservation.getFin().format(timeFormatter);

        // Récupérer le nom de l'enseignant
        String enseignantNom = "N/A";
        try {
            Enseignant enseignant = enseignantRepository.findById(reservation.getMatricule()).orElse(null);
            if (enseignant != null) {
                enseignantNom = enseignant.getNom();
            }
        } catch (Exception e) {
            // En cas d'erreur, garder "N/A"
        }

        return new PlanningReservationDTO(
                debutFormatted,
                finFormatted,
                enseignantNom,
                reservation.getMatricule()
        );
    }
}
