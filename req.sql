CREATE DATABASE  IF NOT EXISTS `csi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `csi`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: csi
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `enseignant`
--

DROP TABLE IF EXISTS `enseignant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enseignant` (
  `matricule` varchar(50) NOT NULL,
  `cle_acces` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`matricule`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `UK6kxdv8s2oqch2dcl5euax55hj` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enseignant`
--

LOCK TABLES `enseignant` WRITE;
/*!40000 ALTER TABLE `enseignant` DISABLE KEYS */;
INSERT INTO `enseignant` VALUES ('ENS001','bryan','Ngoupeyou Bryan','Professeur','ngoupeyoubryan9@gmail.com'),('ENS002','password456','Martin Marie','Maître de conférences','marie.martin@ecole.fr'),('RESP001','admin123','Durand Pierre','Responsable pédagogique','pierre.durand@ecole.fr');
/*!40000 ALTER TABLE `enseignant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formation`
--

DROP TABLE IF EXISTS `formation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formation` (
  `code` varchar(20) NOT NULL,
  `duree` int NOT NULL,
  `debut` varchar(50) DEFAULT NULL,
  `objectif` text,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formation`
--

LOCK TABLES `formation` WRITE;
/*!40000 ALTER TABLE `formation` DISABLE KEYS */;
INSERT INTO `formation` VALUES ('FORM001',40,'2024-09-01','Formation Java - Programmation orientée objet'),('FORM002',60,'2024-10-01','Formation Web - HTML, CSS, JavaScript'),('FORM003',35,'2024-11-01','Formation Spring Boot - Développement d\'APIs'),('FORM004',50,'2024-09-15','Formation Python - Data Science'),('FORM005',45,'2024-10-15','Formation Angular - Framework frontend'),('FORM006',30,'2024-11-15','Formation DevOps - Docker et Kubernetes'),('FORM007',25,'2024-12-01','Formation Sécurité informatique'),('FORM008',55,'2025-01-15','Formation Intelligence Artificielle');
/*!40000 ALTER TABLE `formation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objetreservable`
--

DROP TABLE IF EXISTS `objetreservable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objetreservable` (
  `id_objet` int NOT NULL AUTO_INCREMENT,
  `disponible` tinyint(1) DEFAULT '1',
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`id_objet`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objetreservable`
--

LOCK TABLES `objetreservable` WRITE;
/*!40000 ALTER TABLE `objetreservable` DISABLE KEYS */;
INSERT INTO `objetreservable` VALUES (1,1,'Ordinateur'),(2,1,'Ordinateur'),(3,1,'Ordinateur'),(4,1,'Ordinateur'),(5,1,'Ordinateur'),(6,1,'Video_Projecteur'),(7,1,'Video_Projecteur'),(8,1,'Video_Projecteur'),(9,1,'Video_Projecteur'),(10,1,'Ordinateur'),(11,1,'Ordinateur'),(12,1,'Video_Projecteur');
/*!40000 ALTER TABLE `objetreservable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordinateur`
--

DROP TABLE IF EXISTS `ordinateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordinateur` (
  `id_ordi` varchar(20) NOT NULL,
  `id_objet` int DEFAULT NULL,
  PRIMARY KEY (`id_ordi`),
  KEY `id_objet` (`id_objet`),
  CONSTRAINT `ordinateur_ibfk_1` FOREIGN KEY (`id_objet`) REFERENCES `objetreservable` (`id_objet`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordinateur`
--

LOCK TABLES `ordinateur` WRITE;
/*!40000 ALTER TABLE `ordinateur` DISABLE KEYS */;
INSERT INTO `ordinateur` VALUES ('PC001',1),('PC002',2),('PC003',3),('PC004',4),('PC005',5),('PC006',10),('PC007',11);
/*!40000 ALTER TABLE `ordinateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservationobjet`
--

DROP TABLE IF EXISTS `reservationobjet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservationobjet` (
  `code_reservation` varchar(50) NOT NULL,
  `jour` date NOT NULL,
  `debut` time NOT NULL,
  `fin` time NOT NULL,
  `matricule` varchar(50) DEFAULT NULL,
  `id_objet` int DEFAULT NULL,
  PRIMARY KEY (`code_reservation`),
  KEY `matricule` (`matricule`),
  KEY `id_objet` (`id_objet`),
  CONSTRAINT `reservationobjet_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `enseignant` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `reservationobjet_ibfk_2` FOREIGN KEY (`id_objet`) REFERENCES `objetreservable` (`id_objet`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservationobjet`
--

LOCK TABLES `reservationobjet` WRITE;
/*!40000 ALTER TABLE `reservationobjet` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservationobjet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservationsalle`
--

DROP TABLE IF EXISTS `reservationsalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservationsalle` (
  `code_reservation` varchar(50) NOT NULL,
  `jour` date NOT NULL,
  `debut` time NOT NULL,
  `fin` time NOT NULL,
  `matricule` varchar(50) DEFAULT NULL,
  `n_salle` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`code_reservation`),
  KEY `matricule` (`matricule`),
  KEY `n_salle` (`n_salle`),
  CONSTRAINT `reservationsalle_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `enseignant` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `reservationsalle_ibfk_2` FOREIGN KEY (`n_salle`) REFERENCES `salle` (`n_salle`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservationsalle`
--

LOCK TABLES `reservationsalle` WRITE;
/*!40000 ALTER TABLE `reservationsalle` DISABLE KEYS */;
INSERT INTO `reservationsalle` VALUES ('RES001','2024-01-15','08:00:00','10:00:00','ENS001','A101'),('RES002','2024-01-16','14:00:00','16:00:00','ENS001','B205'),('RES003','2024-01-20','09:00:00','11:00:00','ENS001','A101'),('RES004','2024-01-22','13:00:00','15:00:00','ENS001','C301'),('RES005','2024-02-05','10:00:00','12:00:00','ENS001','A101');
/*!40000 ALTER TABLE `reservationsalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responsable`
--

DROP TABLE IF EXISTS `responsable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responsable` (
  `matricule` varchar(50) NOT NULL,
  PRIMARY KEY (`matricule`),
  CONSTRAINT `responsable_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `enseignant` (`matricule`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responsable`
--

LOCK TABLES `responsable` WRITE;
/*!40000 ALTER TABLE `responsable` DISABLE KEYS */;
INSERT INTO `responsable` VALUES ('RESP001');
/*!40000 ALTER TABLE `responsable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salle`
--

DROP TABLE IF EXISTS `salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salle` (
  `n_salle` varchar(20) NOT NULL,
  `capacite` int NOT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`n_salle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salle`
--

LOCK TABLES `salle` WRITE;
/*!40000 ALTER TABLE `salle` DISABLE KEYS */;
INSERT INTO `salle` VALUES ('A101',30,1),('A102',25,1),('A103',40,1),('B201',50,1),('B202',35,1),('B205',45,1),('C301',20,1),('C302',28,1),('D401',60,1),('LAB01',15,1);
/*!40000 ALTER TABLE `salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_projecteur`
--

DROP TABLE IF EXISTS `video_projecteur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_projecteur` (
  `id_vp` varchar(20) NOT NULL,
  `id_objet` int DEFAULT NULL,
  PRIMARY KEY (`id_vp`),
  KEY `id_objet` (`id_objet`),
  CONSTRAINT `video_projecteur_ibfk_1` FOREIGN KEY (`id_objet`) REFERENCES `objetreservable` (`id_objet`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_projecteur`
--

LOCK TABLES `video_projecteur` WRITE;
/*!40000 ALTER TABLE `video_projecteur` DISABLE KEYS */;
INSERT INTO `video_projecteur` VALUES ('VP001',6),('VP002',7),('VP003',8),('VP004',9),('VP005',12);
/*!40000 ALTER TABLE `video_projecteur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-13 15:04:12
