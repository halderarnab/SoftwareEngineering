Using command line to pass the file name as parameter
=>node csvReader.js fileName.csv

HW2:
Renamed enterFormula to evaluateFormula
Supports inverse range: D4:a1, a3:b2, A3:A1

HW3:
Command to run the file:
=> node .\hw3.js           

Command to run the test file:
=> npx jasmine .\spec\hw3_test_spec.js

Defined this.sum in stdev() function and using it to calculate the sum in mapperVariance() function.

HW4:
Command to run the file:
=> node .\hw4.js           

Command to run the test file:
=> npx jasmine .\spec\hw4_test_spec.js

Used supertest to create API tests in jasmine.
Supporting text/plain, text/xml, application/json.
Have used status codes 400, 405 and 415.
Only supporting POST method.

API: http://localhost:8080
Header: content-type
Method: POST

HW5:
Command to run the file:
=> node .\hw5.js           

Command to run the test file:
=> npx jasmine .\spec\hw5_test_spec.js

Used supertest to create API tests in jasmine.

Supporting application/json.

Have used status codes 400, 404, 405, 415 and 500.

Only supporting GET, POST, PUT and DELETE methods.

Only supporting simple CRUD operations.

URL: http://localhost:8080
Header: content-type

Supported APIs:
1) Method: GET
/all
/id/{number}

2) Method: POST
/createRow
Sample body:
{
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
}

3) Method: PUT
/updateRow
Sample body:
{
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
}

4) Method: DELETE
/deleteRow
Sample body:
{
            "id": '6'
}

=====================================================================================================================================================
SQL code. Also added the Dump20231101.sql file in the zip folder.
=====================================================================================================================================================
CREATE DATABASE  IF NOT EXISTS `testdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `testdb`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: testdb
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

--
-- Table structure for table `testtable`
--

DROP TABLE IF EXISTS `testtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testtable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Col1` varchar(45) DEFAULT NULL,
  `Col2` varchar(45) DEFAULT NULL,
  `Col3` varchar(45) DEFAULT NULL,
  `Col4` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testtable`
--

LOCK TABLES `testtable` WRITE;
/*!40000 ALTER TABLE `testtable` DISABLE KEYS */;
INSERT INTO `testtable` VALUES (1,'1','2','3','4'),(2,'2','3','4','5'),(3,'3','4','5','6'),(4,'4','5','6','7'),(5,'5','5','6','7');
/*!40000 ALTER TABLE `testtable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-01 22:57:03
=====================================================================================================================================================

HW6:
There are 2 files: hw6_A.js and hw6_B.js
hw6_A.js: It has Part A of the question and the Server for Part B, i.e., "rtt" is calculated in the same file as the server.
hw6_B.js: This contains the client side of Part B.

Command to run the server and client:
First run the server in a terminal and then run the client as and when required via another terminal instance.
(Server) => node .\hw6_A.js           
(Client) => node .\hw6_B.js           

Command to run the test file:
=> npx jasmine .\spec\hw6_test_spec.js

Used supertest to create API tests in jasmine.
Supporting text/plain.
Have used status codes 400, 405 and 415.
Only supporting POST method.

API: http://localhost:8080
Header: content-type
Method: POST

Observation:
When the logic for setting the timeouts is correct, it can be seen that the delays (client to server and server to client) are within the acceptable parameters. I have verified this by setting different values for delays both in the client and the server. Also, for observation purpose the values for both server and client side delays were kept high (5-10 seconds) for few scenarios.
When the timeouts were in improper places, the server and client outputs were not coming up in the correct order. Hence, failing the simulation.
Note that as we are using random number between 0 and "rtt", there are possible scenarios where the delay between client to server and server to client may be different.