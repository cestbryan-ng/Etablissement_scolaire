package com.example.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationObjetRepository extends JpaRepository<ReservationObjet, String> {

    // Trouver les réservations d'objets pour une période donnée
    @Query("SELECT r FROM ReservationObjet r WHERE r.jour = :jour " +
            "AND ((r.debut < :fin AND r.fin > :debut))")
    List<ReservationObjet> findConflictingReservations(
            @Param("jour") LocalDate jour,
            @Param("debut") LocalTime debut,
            @Param("fin") LocalTime fin
    );

    // Trouver les réservations d'un enseignant entre deux dates
    @Query("SELECT r FROM ReservationObjet r WHERE r.matricule = :matricule " +
            "AND r.jour >= :dateDebut AND r.jour <= :dateFin " +
            "ORDER BY r.jour ASC, r.debut ASC")
    List<ReservationObjet> findByMatriculeAndJourBetween(
            @Param("matricule") String matricule,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin
    );

    // Compter les objets réservés d'un type donné pour une période
    @Query("SELECT COUNT(r) FROM ReservationObjet r " +
            "JOIN ObjetReservable o ON r.idObjet = o.idObjet " +
            "WHERE o.type = :type AND r.jour = :jour " +
            "AND ((r.debut < :fin AND r.fin > :debut))")
    Long countReservedObjectsByTypeAndPeriod(
            @Param("type") String type,
            @Param("jour") LocalDate jour,
            @Param("debut") LocalTime debut,
            @Param("fin") LocalTime fin
    );
}