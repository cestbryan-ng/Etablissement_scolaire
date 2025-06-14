package com.example.test;

public class PlanningReservationDTO {
        private String debut;        // Format HH:mm
        private String fin;          // Format HH:mm
        private String enseignantNom;
        private String matricule;

        // Constructeurs
        public PlanningReservationDTO() {}

        public PlanningReservationDTO(String debut, String fin, String enseignantNom, String matricule) {
            this.debut = debut;
            this.fin = fin;
            this.enseignantNom = enseignantNom;
            this.matricule = matricule;
        }

        // Getters et Setters
        public String getDebut() { return debut; }
        public void setDebut(String debut) { this.debut = debut; }

        public String getFin() { return fin; }
        public void setFin(String fin) { this.fin = fin; }

        public String getEnseignantNom() { return enseignantNom; }
        public void setEnseignantNom(String enseignantNom) { this.enseignantNom = enseignantNom; }

        public String getMatricule() { return matricule; }
        public void setMatricule(String matricule) { this.matricule = matricule; }
}
