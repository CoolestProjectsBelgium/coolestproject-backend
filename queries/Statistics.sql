DROP TABLE IF EXISTS stats_language;

CREATE table stats_language
(
  `eventId` int NOT NULL,
  `project_lang` enum('nl','fr','en') NOT NULL,
  `count` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`eventId`, `project_lang`)
)
SELECT 
	eventId,
	project_lang,
	count(id) as count
FROM projects p
group by eventid, project_lang
order by 1, 2
;

--

DROP TABLE IF EXISTS stats_demographics;

CREATE TABLE stats_demographics
(  
  `eventId` int NOT NULL,
  `language` enum('nl','fr','en') NOT NULL,
  `sex` enum('m','f','x') NOT NULL,
  `age` bigint NOT NULL,
  `count` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`eventId`, `language`, `sex`, `age`)
)
SELECT 
	u.eventId,
	u.language,
	u.sex,
    floor(datediff(e.officialStartDate, u.birthmonth)/365) as age,
	count(u.id) as count
FROM users u
inner join events e on u.eventId = e.id
GROUP BY u.eventId,
	u.language,
	u.sex,
    floor(datediff(e.officialStartDate, u.birthmonth)/365)
order by 1, 2, 3, 4
;

--

DROP TABLE IF EXISTS stats_genderage;

CREATE TABLE stats_genderage
(  
  `eventId` int NOT NULL,
  `sex` enum('m','f','x') NOT NULL,
  `age` bigint NOT NULL,
  `count` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`eventId`, `sex`, `age`)
)
SELECT
	u.eventId,
	u.sex,
    floor(datediff(e.officialStartDate, u.birthmonth)/365) as age,
	count(u.id) as count
FROM users u
inner join events e on u.eventId = e.id
GROUP BY u.eventId,
	u.sex,
    floor(datediff(e.officialStartDate, u.birthmonth)/365)
order by 1, 2, 3
;

--

DROP TABLE IF EXISTS stats_languagegender;

CREATE TABLE stats_languagegender
(
  `eventId` int NOT NULL,
  `language` enum('nl','fr','en') NOT NULL,
  `sex` enum('m','f','x') NOT NULL,
  `count` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`eventId`, `language`, `sex`)
)
SELECT 
	u.eventId,
	u.language,
	u.sex,
	count(u.id) as count
FROM users u
inner join events e on u.eventId = e.id
GROUP BY u.eventId,
	u.language,
	u.sex
order by 1, 2, 3
;

--

DROP TABLE IF EXISTS stats_teams;

CREATE TABLE stats_teams 
 (
  `eventid` int NOT NULL,
  `deelnmers_per_project` bigint NOT NULL DEFAULT '0',
  `aantal_in_dit_geval` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`eventid`, `deelnmers_per_project`)
) 
select
	sub.eventid,
	sub.deelnemers as deelnmers_per_project,
	count(sub.projectid) as aantal_in_dit_geval
FROM
(
	SELECT 
	p.eventId,
	p.Id as projectId,
	count(participantId)+1 as deelnemers
	FROM vouchers v right outer join projects p on v.projectId = p.id
	group by p.eventId,
	p.Id
	order by 1, 2
) as sub
group by 
	sub.eventid,
	sub.deelnemers
order by 1, 2
;
