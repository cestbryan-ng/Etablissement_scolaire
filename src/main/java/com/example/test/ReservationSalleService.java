package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationSalleService {

    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private ReservationSalleRepository reservationSalleRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public ReservationSalleResponse rechercherSallesDisponibles(ReservationSalleRequest request) {
        try {
            // Validation et conversion des données
            LocalDate dateReservation = parseDate(request.getDate());
            if (dateReservation == null) {
                return new ReservationSalleResponse(false, "Format de date invalide");
            }

            LocalTime heureDebut = parseTime(request.getHeureDebut());
            LocalTime heureFin = parseTime(request.getHeureFin());
            if (heureDebut == null || heureFin == null) {
                return new ReservationSalleResponse(false, "Format d'heure invalide");
            }

            if (heureFin.isBefore(heureDebut) || heureFin.equals(heureDebut)) {
                return new ReservationSalleResponse(false, "L'heure de fin doit être postérieure à l'heure de début");
            }

            // Vérifier que l'enseignant existe
            if (!enseignantRepository.existsById(request.getMatricule())) {
                return new ReservationSalleResponse(false, "Enseignant non trouvé");
            }

            // Récupérer toutes les salles avec capacité suffisante et disponibles
            List<Salle> sallesCapaciteSuffisante = salleRepository.findAll().stream()
                    .filter(salle -> salle.getDisponible() != null && salle.getDisponible() &&
                            salle.getCapacite() != null && salle.getCapacite() >= request.getNombrePlacesMin())
                    .collect(Collectors.toList());

            if (sallesCapaciteSuffisante.isEmpty()) {
                return new ReservationSalleResponse(false,
                        "Aucune salle ne correspond au nombre de places requis (" +
                                request.getNombrePlacesMin() + " places)");
            }

            // Vérifier la disponibilité pour la période demandée
            List<SalleDisponibleDTO> sallesDisponibles = sallesCapaciteSuffisante.stream()
                    .filter(salle -> isSalleDisponible(salle.getnSalle(), dateReservation, heureDebut, heureFin))
                    .map(salle -> new SalleDisponibleDTO(
                            salle.getnSalle(),   // Utilise getnSalle() de votre classe Salle
                            salle.getCapacite(),
                            "Disponible"
                    ))
                    .collect(Collectors.toList());

            String periode = request.getDate() + " de " + request.getHeureDebut() + " à " + request.getHeureFin();

            if (sallesDisponibles.isEmpty()) {
                return new ReservationSalleResponse(false,
                        "Aucune salle n'est libre pour la période spécifiée");
            }

            return new ReservationSalleResponse(
                    true,
                    "Salles disponibles trouvées",
                    sallesDisponibles,
                    periode,
                    request.getNombrePlacesMin()
            );

        } catch (Exception e) {
            return new ReservationSalleResponse(false, "Erreur lors de la recherche: " + e.getMessage());
        }
    }

    public ReservationSalleResponse confirmerReservation(String matricule, String nSalle,
                                                         String date, String heureDebut, String heureFin) {
        try {
            // Validation des données
            LocalDate dateReservation = parseDate(date);
            LocalTime timeDebut = parseTime(heureDebut);
            LocalTime timeFin = parseTime(heureFin);

            if (dateReservation == null || timeDebut == null || timeFin == null) {
                return new ReservationSalleResponse(false, "Données invalides");
            }

            // Vérifier que la salle existe
            Salle salle = salleRepository.findByNSalle(nSalle);
            if (salle == null) {
                return new ReservationSalleResponse(false, "Salle inexistante");
            }

            // Vérifier que la salle est disponible
            if (salle.getDisponible() == null || !salle.getDisponible()) {
                return new ReservationSalleResponse(false, "Salle indisponible");
            }

            // Vérifier que la salle est toujours disponible pour cette période
            if (!isSalleDisponible(nSalle, dateReservation, timeDebut, timeFin)) {
                return new ReservationSalleResponse(false, "La salle n'est plus disponible pour cette période");
            }

            // Générer un code de réservation unique
            String codeReservation = "RES_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // Créer la réservation
            ReservationSalle reservation = new ReservationSalle(
                    codeReservation,
                    dateReservation,
                    timeDebut,
                    timeFin,
                    matricule,
                    nSalle
            );

            // Sauvegarder
            reservationSalleRepository.save(reservation);

            ReservationSalleResponse response = new ReservationSalleResponse(true,
                    "Réservation effectuée avec succès");
            response.setCodeReservation(codeReservation);
            response.setPeriode(date + " de " + heureDebut + " à " + heureFin);

            return response;

        } catch (Exception e) {
            return new ReservationSalleResponse(false, "Erreur lors de la réservation: " + e.getMessage());
        }
    }

    private boolean isSalleDisponible(String nSalle, LocalDate date, LocalTime heureDebut, LocalTime heureFin) {
        List<ReservationSalle> reservationsExistantes = reservationSalleRepository
                .findByNSalleAndJour(nSalle, date);

        for (ReservationSalle reservation : reservationsExistantes) {
            // Vérifier s'il y a conflit d'horaires
            if (!(heureFin.isBefore(reservation.getDebut()) ||
                    heureDebut.isAfter(reservation.getFin()) ||
                    heureDebut.equals(reservation.getFin()))) {
                return false; // Conflit détecté
            }
        }
        return true; // Pas de conflit
    }

    private LocalDate parseDate(String dateString) {
        try {
            return LocalDate.parse(dateString, dateFormatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private LocalTime parseTime(String timeString) {
        try {
            return LocalTime.parse(timeString, timeFormatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}