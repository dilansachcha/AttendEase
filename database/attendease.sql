-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.39 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table attendease.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table attendease.admin: ~0 rows (approximately)
DELETE FROM `admin`;
INSERT INTO `admin` (`id`, `username`, `password`, `mobile`) VALUES
	(1, 'dilan', 'aqimCMP@123', '0776592267');

-- Dumping structure for table attendease.attendance
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `check_in_time` datetime DEFAULT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `employee_id` int NOT NULL,
  `attendance_status_id` int NOT NULL DEFAULT (1),
  PRIMARY KEY (`id`),
  KEY `fk_attendance_attendance_status_idx` (`attendance_status_id`),
  KEY `fk_attendance_employee1_idx` (`employee_id`),
  CONSTRAINT `fk_attendance_attendance_status` FOREIGN KEY (`attendance_status_id`) REFERENCES `attendance_status` (`id`),
  CONSTRAINT `fk_attendance_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table attendease.attendance: ~18 rows (approximately)
DELETE FROM `attendance`;
INSERT INTO `attendance` (`id`, `check_in_time`, `check_out_time`, `employee_id`, `attendance_status_id`) VALUES
	(22, '2024-12-05 05:53:26', '2024-12-05 11:51:00', 11, 4),
	(23, '2024-12-05 05:55:02', '2024-12-05 21:05:00', 5, 8),
	(30, '2024-12-05 21:13:15', '2024-12-05 21:26:39', 12, 5),
	(32, '2024-12-05 21:47:17', '2024-12-05 21:56:11', 13, 5),
	(36, '2024-12-06 01:26:46', '2024-12-06 14:50:39', 10, 8),
	(37, '2024-12-06 01:27:30', '2024-12-06 11:28:15', 12, 7),
	(40, '2024-12-07 11:03:04', '2024-12-07 22:38:31', 10, 3),
	(41, '2024-12-07 11:51:02', '2024-12-07 11:52:53', 5, 5),
	(48, '2024-12-09 17:28:08', '2024-12-09 23:40:31', 5, 4),
	(57, '2024-12-09 21:28:01', '2024-12-09 21:29:49', 13, 5),
	(58, '2024-12-19 20:09:39', '2024-12-19 23:07:03', 5, 5),
	(59, '2024-12-19 23:03:16', '2024-12-19 23:18:10', 11, 5),
	(61, '2024-12-20 00:07:32', '2024-12-20 09:45:19', 5, 6),
	(67, '2024-12-20 02:02:01', '2024-12-20 19:05:33', 12, 8),
	(87, '2024-12-21 12:56:06', NULL, 15, 2),
	(88, '2024-12-21 14:52:40', NULL, 11, 2),
	(89, '2024-12-21 14:53:46', NULL, 10, 2),
	(90, '2024-12-21 14:58:05', '2024-12-21 14:59:25', 5, 5);

-- Dumping structure for table attendease.attendance_status
CREATE TABLE IF NOT EXISTS `attendance_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table attendease.attendance_status: ~7 rows (approximately)
DELETE FROM `attendance_status`;
INSERT INTO `attendance_status` (`id`, `status`) VALUES
	(1, 'Absent'),
	(2, 'Present'),
	(3, 'Full-Day'),
	(4, 'Half-Day'),
	(5, 'No-Pay'),
	(6, 'OT - by 01 hr'),
	(7, 'OT - by 02hrs'),
	(8, 'OT - by 03 or more hrs');

-- Dumping structure for table attendease.employee
CREATE TABLE IF NOT EXISTS `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mobile` varchar(10) NOT NULL,
  `email` varchar(150) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `department` varchar(45) NOT NULL,
  `jobrole` varchar(45) NOT NULL,
  `passkey` varchar(6) NOT NULL,
  `registered_date_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table attendease.employee: ~6 rows (approximately)
DELETE FROM `employee`;
INSERT INTO `employee` (`id`, `mobile`, `email`, `first_name`, `last_name`, `department`, `jobrole`, `passkey`, `registered_date_time`) VALUES
	(5, '0776592265', 'bmgbasnayake@gmail.com', 'BMG ', 'Basnayake ', 'Finance ', 'CFO', 'CCC11', '2024-12-04 20:30:07'),
	(10, '0771234567', 'dilansachintha44@gmail.com', 'Dilan', 'Manage', 'Production ', 'Supply Chain Manager', '12345', '2024-12-04 21:44:28'),
	(11, '0774442288', 'd_sachintha@live.com', 'Savinda', 'Rukshan', 'IT', 'Senior SE', 'ABBD', '2024-12-05 05:52:19'),
	(12, '0777777777', 'sachchamanage@gmail.com', 'Khalil', 'Rountree', 'HR', 'Training Head', 'ABBC', '2024-12-05 14:09:40'),
	(13, '0712345566', 'thulashinimanage85@gmail.com', 'Thulashini', 'Manage', 'Finance', 'Accounting Assistant ', 'BABC', '2024-12-05 21:24:14'),
	(15, '0713401637', 'bmgbasnayake62@gmail.com', 'Bm', 'Basn', 'HR', 'Training Lead', '999BA', '2024-12-21 02:50:53');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
