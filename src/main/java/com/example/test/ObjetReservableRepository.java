package com.example.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObjetReservableRepository extends JpaRepository<ObjetReservable, Integer> {

    // Trouver tous les objets disponibles d'un type donné
    List<ObjetReservable> findByTypeAndDisponibleTrue(String type);

    // Compter les objets disponibles par type
    @Query("SELECT COUNT(o) FROM ObjetReservable o WHERE o.type = :type AND o.disponible = true")
    Long countByTypeAndDisponibleTrue(@Param("type") String type);

    // Compter le total d'objets par type
    Long countByType(String type);

    // Trouver tous les types d'objets distincts
    @Query("SELECT DISTINCT o.type FROM ObjetReservable o")
    List<String> findDistinctTypes();
}