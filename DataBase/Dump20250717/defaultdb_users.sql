-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: mysql-2eb9bfd8-nimeshhiruna.j.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.35

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '3653b0c0-58fd-11f0-814b-862ccfb017ad:1-47,
5c6424dd-62ee-11f0-b7fe-862ccfb06930:1-15';

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hirunanimesh','hirunim610@gmail.com','student','$2b$10$v8DnegeeKoJ.nCA.6ceEDeuUuZtFq39HxtGHCTpPt/CYtJggT0FCu'),(2,'Thilini','thilini@gmail.com','teacher','$2b$10$CMIZJ12JGg6bNP5SIEn1.eYtJr6Nzl7vKSbQknOJYdfV5UuTJ8hxa'),(6,'Dasun','dasuncompetition@gmail.com','teacher','$2b$10$JLXt7zIygQbBaPYtMDxks.tw16lLq23n2v3.5bnlKX8ALPCB5bXN2'),(7,'asith','asith@gmail.com','student','$2b$10$aBNdykne4s55wYlakCuRT..iIj2EVk2Rnn/tFeZ0KL.vVeG9s5EE2'),(8,'rohini','rohini@gmail.com','teacher','$2b$10$4zrTXiglwkEVOxeGT4/Ex.B4FkYt9fs40yMZrQ5ZKwbBYrl6Gy4m6'),(9,'ravindu','ravindu@gmail.com','teacher','$2b$10$SyCeK9bi4qMDF6mbWUxV8uJWWd3i/mP5mIiADocMrVl3GaPAUGBeC'),(11,'Thiliniprasadani','thiliniprasadani20@gmail.com','teacher','$2b$10$IZ31FI5ECwL7k6WrAna0Yuxabn2ErJnpNXRxptjw4c/bghBN.sdx2'),(15,'Hiruna Nimesh','nimeshhiruna@gmail.com','student',NULL),(16,'Ashan Jayasinghe','ashancharith648@gmail.com','teacher',NULL),(17,'Hiruna jayasinghe','hiruna.22@cse.mrt.ac.lk','teacher',NULL),(18,'Asith Dilusha','asithdilusha3@gmail.com','student',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-17 15:02:29
