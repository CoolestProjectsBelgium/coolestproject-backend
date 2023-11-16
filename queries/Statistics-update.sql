DROP procedure IF EXISTS `statistics-update`;

delimiter //

CREATE PROCEDURE `statistics-update` ()
BEGIN

REPLACE INTO stats_language
SELECT
	eventId,
	project_lang,
	count(id) as count
FROM projects p
group by eventid, project_lang
order by 1, 2
;

REPLACE INTO stats_demographics
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

REPLACE INTO stats_languagegender
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

REPLACE INTO stats_languagegender
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

REPLACE INTO stats_teams
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

END
//

delimiter ;

CALL `statistics-update`();
