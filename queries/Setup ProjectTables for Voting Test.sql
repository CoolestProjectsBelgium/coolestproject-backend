/*
 * Script om de Voting app te testen
 * Brute force setup van de Project Tables
 */


START TRANSACTION;

SELECT @eventId := id FROM `events`
WHERE eventBeginDate <= CURDATE() and CURDATE() <= eventEndDate;

SELECT @table0 := MIN(id) FROM `tables`
WHERE eventid = @eventId;

select @table0;

INSERT INTO `voting`.`projecttables`
(
`ProjectId`,
`TableId`,
`createdAt`,
`updatedAt`,
`EventId`)
SELECT 
	p.`id`
	, @table0 + (ROW_NUMBER() over w) - 1
    , now()
    , now()
    , @eventId
FROM projects p
WHERE eventid = @eventId
WINDOW w AS (ORDER BY id);

SELECT * from projecttables where eventid = @eventid;

-- ROLLBACK
COMMIT;
