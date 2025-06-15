package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationMaterielService {

    @Autowired
    private ObjetReservableRepository objetReservableRepository;

    @Autowired
    private ReservationObjetRepository reservationObjetRepository;

    @Autowired
    private ReservationSalleRepository reservationSalleRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public ReservationMaterielResponse consulterDisponibilite(ReservationMaterielRequest request) {
        try {
            // Validation et conversion des données
            LocalDate dateReservation = parseDate(request.getDate());
            if (dateReservation == null) {
                return new ReservationMaterielResponse(false, "Format de date invalide");
            }

            LocalTime heureDebut = parseTime(request.getHeureDebut());
            LocalTime heureFin = parseTime(request.getHeureFin());
            if (heureDebut == null || heureFin == null) {
                return new ReservationMaterielResponse(false, "Format d'heure invalide");
            }

            if (heureFin.isBefore(heureDebut) || heureFin.equals(heureDebut)) {
                return new ReservationMaterielResponse(false, "L'heure de fin doit être postérieure à l'heure de début");
            }

            // Vérifier que l'enseignant existe
            if (!enseignantRepository.existsById(request.getMatricule())) {
                return new ReservationMaterielResponse(false, "Enseignant non trouvé");
            }

            // VALIDATION CRITIQUE : Vérifier qu'il existe une réservation de salle pour cette période
            boolean aSalleReservee = reservationSalleRepository
                    .findByMatriculeAndJourBetween(request.getMatricule(), dateReservation, dateReservation)
                    .stream()
                    .anyMatch(reservationSalle ->
                            !(heureFin.isBefore(reservationSalle.getDebut()) ||
                                    heureDebut.isAfter(reservationSalle.getFin()) ||
                                    heureDebut.equals(reservationSalle.getFin()))
                    );

            if (!aSalleReservee) {
                return new ReservationMaterielResponse(false, "Veuillez d'abord réserver une salle");
            }

            // Récupérer la disponibilité des matériels
            List<MaterielDisponibleDTO> materielsDisponibles = new ArrayList<>();

            // Types de matériel disponibles
            String[] typesMateriel = {"Ordinateur", "Video_Projecteur"};

            for (String type : typesMateriel) {
                Long totalDisponibles = objetReservableRepository.countByTypeAndDisponibleTrue(type);
                Long totalReserves = reservationObjetRepository.countReservedObjectsByTypeAndPeriod(
                        type, dateReservation, heureDebut, heureFin);

                Long quantiteDisponible = totalDisponibles - totalReserves;
                Long quantiteTotal = objetReservableRepository.countByType(type);

                if (quantiteDisponible > 0) {
                    materielsDisponibles.add(new MaterielDisponibleDTO(
                            type,
                            quantiteDisponible.intValue(),
                            quantiteTotal.intValue()
                    ));
                }
            }

            String periode = request.getDate() + " de " + request.getHeureDebut() + " à " + request.getHeureFin();

            if (materielsDisponibles.isEmpty()) {
                return new ReservationMaterielResponse(false, "Aucun matériel n'est disponible pour cette période");
            }

            return new ReservationMaterielResponse(
                    true,
                    "Matériels disponibles trouvés",
                    materielsDisponibles,
                    periode
            );

        } catch (Exception e) {
            return new ReservationMaterielResponse(false, "Erreur lors de la consultation: " + e.getMessage());
        }
    }

    public ReservationMaterielResponse confirmerReservation(String matricule, String typeMateriel,
                                                            Integer quantite, String date,
                                                            String heureDebut, String heureFin) {
        try {
            // Validation des données
            LocalDate dateReservation = parseDate(date);
            LocalTime timeDebut = parseTime(heureDebut);
            LocalTime timeFin = parseTime(heureFin);

            if (dateReservation == null || timeDebut == null || timeFin == null) {
                return new ReservationMaterielResponse(false, "Données invalides");
            }

            // Vérifier à nouveau la disponibilité
            Long totalDisponibles = objetReservableRepository.countByTypeAndDisponibleTrue(typeMateriel);
            Long totalReserves = reservationObjetRepository.countReservedObjectsByTypeAndPeriod(
                    typeMateriel, dateReservation, timeDebut, timeFin);

            Long quantiteDisponible = totalDisponibles - totalReserves;

            if (quantiteDisponible < quantite) {
                return new ReservationMaterielResponse(false,
                        "Quantité insuffisante. Disponible : " + quantiteDisponible);
            }

            // Récupérer les objets disponibles
            List<ObjetReservable> objetsDisponibles = objetReservableRepository
                    .findByTypeAndDisponibleTrue(typeMateriel);

            // Filtrer ceux qui ne sont pas réservés pour cette période
            List<ObjetReservable> objetsLibres = objetsDisponibles.stream()
                    .filter(objet -> isObjetLibre(objet.getIdObjet(), dateReservation, timeDebut, timeFin))
                    .limit(quantite)
                    .toList();

            if (objetsLibres.size() < quantite) {
                return new ReservationMaterielResponse(false, "Objets non disponibles");
            }

            // Créer les réservations
            List<String> codesReservation = new ArrayList<>();
            for (ObjetReservable objet : objetsLibres) {
                String codeReservation = "RESOBJ_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

                ReservationObjet reservation = new ReservationObjet(
                        codeReservation,
                        dateReservation,
                        timeDebut,
                        timeFin,
                        matricule,
                        objet.getIdObjet()
                );

                reservationObjetRepository.save(reservation);
                codesReservation.add(codeReservation);
            }

            // Trouver la salle réservée pour cette période
            String salleReservee = reservationSalleRepository
                    .findByMatriculeAndJourBetween(matricule, dateReservation, dateReservation)
                    .stream()
                    .filter(reservationSalle ->
                            !(timeFin.isBefore(reservationSalle.getDebut()) ||
                                    timeDebut.isAfter(reservationSalle.getFin()) ||
                                    timeDebut.equals(reservationSalle.getFin())))
                    .findFirst()
                    .map(ReservationSalle::getnSalle)
                    .orElse("N/A");

            ReservationMaterielResponse response = new ReservationMaterielResponse(true,
                    "Réservation de matériel effectuée avec succès");
            response.setCodesReservation(codesReservation);
            response.setPeriode(date + " de " + heureDebut + " à " + heureFin);
            response.setSalleReservee(salleReservee);

            return response;

        } catch (Exception e) {
            return new ReservationMaterielResponse(false, "Erreur lors de la réservation: " + e.getMessage());
        }
    }

    private boolean isObjetLibre(Integer idObjet, LocalDate date, LocalTime heureDebut, LocalTime heureFin) {
        List<ReservationObjet> reservationsExistantes = reservationObjetRepository
                .findConflictingReservations(date, heureDebut, heureFin)
                .stream()
                .filter(reservation -> reservation.getIdObjet().equals(idObjet))
                .toList();

        return reservationsExistantes.isEmpty();
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