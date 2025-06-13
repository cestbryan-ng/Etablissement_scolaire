package com.example.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private EnseignantRepository enseignantRepository;

    public Optional<Enseignant> authenticate(String email, String password) {
        return enseignantRepository.findByEmailAndCleAcces(email, password);
    }

    public Optional<Enseignant> findByMatricule(String matricule) {
        return enseignantRepository.findById(matricule);
    }
}