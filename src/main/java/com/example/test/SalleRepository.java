package com.example.test;

import com.example.test.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalleRepository extends JpaRepository<Salle, String> {

    // Vérifier si une salle existe
    boolean existsByNSalle(String nSalle);

    // Trouver une salle par son numéro
    Salle findByNSalle(String nSalle);
}
