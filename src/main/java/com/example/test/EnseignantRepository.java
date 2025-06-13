package com.example.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, String> {
    Optional<Enseignant> findByEmailAndCleAcces(String email, String cleAcces);
    Optional<Enseignant> findByEmail(String email);
}
