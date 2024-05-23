create database if not exists ps8-dsw-sc2b;

create user if not exists dsw@'%' identified by 'dsw';
grant select, update, insert, delete on ps8-dsw-sc2b.* to dsw@'%';

use ps8-dsw-sc2b;

create table if not exists `ps8-dsw-sc2b`.`game-types` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `description` VARCHAR(255) NULL,
  `tags` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

insert into ps8-dsw-sc2b.characters values(1, 'Classic Fighter', 'type of action game with 1v1 fights', 'MK, SF, Killer Instict');
insert into ps8-dsw-sc2b.characters values(2, 'Platform Fighter', 'type of action game that involves platforming', 'Smash Bros, Brawlhalla');
