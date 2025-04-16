CREATE OR REPLACE VIEW `missing-uploads` AS
SELECT 
	p.eventid AS EventId,
    p.id AS ProjectId,        
	p.project_name AS project_name,
	u.firstname AS firstname,
	u.lastname AS lastname,
	p.ownerId AS ownerId,
	u.email,
	u.email_guardian,
	u.language
FROM
	projects p        
	inner JOIN users u on u.id = p.ownerId
	LEFT OUTER JOIN attachments a on p.id = a.ProjectId
WHERE
	p.eventid = (SELECT id FROM events WHERE registrationClosedDate <= CURDATE() and CURDATE() <= eventEndDate)
	AND a.name is NULL
ORDER BY u.lastname