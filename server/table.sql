-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
-- NOTE! PLEASE MAKE SURE THIS IS NOT UNDER A ROOT ACCOUNT, you should have this database created by a single user
-- ALSO - you may not need these set items at the top.
-- Host: 127.0.0.1:3307
-- Generation Time: Dec 17, 2018 at 08:56 PM
-- Server version: 10.3.9-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `highscores`
--

-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
CREATE TABLE IF NOT EXISTS `entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `state` int(11) NOT NULL DEFAULT 0,
  `name` varchar(511) CHARACTER SET latin1 NOT NULL,
  `score` int(11) NOT NULL,
  `email` varchar(511) CHARACTER SET latin1 NOT NULL,
  `client_secret` varchar(255) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `entries`
--

INSERT INTO `entries` (`id`, `timestamp`, `state`, `name`, `score`, `email`, `client_secret`) VALUES
(1, '2018-12-16 13:56:15', 0, 'BURT', 56765, 'test_email@domain.com', 'test_data'),
(2, '2018-12-16 13:56:15', 0, 'TOD', 56720, '', 'test_data');
COMMIT;
