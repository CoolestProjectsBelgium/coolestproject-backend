CREATE OR REPLACE VIEW `ReceptionDesk` AS
SELECT 
    u.`firstname`,
    u.`lastname`,
    u.`language`,
    u.`sex`,
    t.name AS TShirt,
    CASE WHEN ph.Agree IS NULL THEN 'NO PHOTO' ELSE '' END as Photo,
    p.project_name,
    ta.name as TableName,
    u.`medical`,
    u.via,
    u.`email`,
    u.`gsm`,
    u.`gsm_guardian`,
    u.`email_guardian`
FROM
    users u
        INNER JOIN
    tshirts t ON t.id = u.sizeId
        LEFT JOIN
    vouchers v ON u.id = v.participantId
        LEFT JOIN
    projects p ON (p.ownerId = u.id OR p.id = v.projectId)
		LEFT JOIN
	projecttables pt ON pt.ProjectId = p.id
		LEFT JOIN
	tables ta on ta.id = pt.TableId
		LEFT OUTER JOIN 
	( 
	SELECT qu.UserId, q.name as Agree, qu.eventid
	FROM questionusers qu
	inner join questions q on (qu.QuestionId = q.id and q.name like '%photo%')
	) ph
	on u.id = ph.UserId and ph.eventid = u.eventid
WHERE
    u.eventid = (SELECT id FROM voting.events WHERE registrationClosedDate <= CURDATE() and CURDATE() <= eventEndDate)
ORDER BY lastname , firstname
;

SELECT * FROM `ReceptionDesk`;
