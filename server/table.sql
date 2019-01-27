-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
-- NOTE! PLEASE MAKE SURE THIS IS NOT UNDER A ROOT ACCOUNT, you should have this database created by a single user
-- ALSO - you may not need these set items at the top.
-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jan 27, 2019 at 10:46 AM
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
  `marketing` int(11) NOT NULL,
  `client_secret` varchar(255) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
COMMIT;