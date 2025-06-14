package com.example.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationSalleRepository extends JpaRepository<ReservationSalle, String> {

    // Trouver les réservations d'un enseignant entre deux dates
    @Query("SELECT r FROM ReservationSalle r WHERE r.matricule = :matricule " +
            "AND r.jour >= :dateDebut AND r.jour <= :dateFin " +
            "ORDER BY r.jour ASC, r.debut ASC")
    List<ReservationSalle> findByMatriculeAndJourBetween(
            @Param("matricule") String matricule,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin
    );
    // Nouvelle méthode pour le planning d'une salle
    @Query("SELECT r FROM ReservationSalle r WHERE r.nSalle = :nSalle AND r.jour = :jour ORDER BY r.debut ASC")
    List<ReservationSalle> findByNSalleAndJour(
            @Param("nSalle") String nSalle,
            @Param("jour") LocalDate jour
    );

    // Trouver toutes les réservations d'un enseignant
    List<ReservationSalle> findByMatriculeOrderByJourDescDebutDesc(String matricule);
}
