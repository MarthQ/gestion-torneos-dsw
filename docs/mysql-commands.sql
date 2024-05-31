CREATE database if not exists okiDSW;

USE okiDSW;

-- TODO: Check if we should do another table for the tags, and replace the string with a foreign key

CREATE table if not exists `okiDSW`.`gameTypes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `description` VARCHAR(255) NULL,
  `tags` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

CREATE table if not exists `okiDSW`.`locations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

CREATE table if not exists `okiDSW`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `mail` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

INSERT INTO okiDSW.gameTypes VALUES(1, 'Classic Fighter', 'type of action game with 1v1 fights', 'MK, SF, Killer Instinct');
INSERT INTO okiDSW.gameTypes VALUES(2, 'Platform Fighter', 'type of action game that involves platforming', 'Smash Bros, Brawlhalla');
