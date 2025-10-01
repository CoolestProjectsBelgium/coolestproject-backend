SELECT 
    u.`firstname`,
    u.`lastname`,
    u.`language`,
    u.`sex`,
    CASE WHEN ph.Agree IS NULL THEN 'NO CONTACT' ELSE '' END as Contact,
    p.project_name,
    -- u.`medical`,
    u.via,
    u.`email`,
    u.`gsm`,
    u.`gsm_guardian`,
    u.`email_guardian`
FROM
    users u
       
        LEFT JOIN
    vouchers v ON u.id = v.participantId
        LEFT JOIN
    projects p ON (p.ownerId = u.id OR p.id = v.projectId)
		
		LEFT OUTER JOIN 
	( 
	SELECT qu.UserId, q.name as Agree, qu.eventid
	FROM questionusers qu
	inner join questions q on (qu.QuestionId = q.id and q.name like '%contact%')
	) ph
	on u.id = ph.UserId and ph.eventid = u.eventid
WHERE
    u.eventid = (SELECT id-1 FROM events WHERE registrationOpenDate <= CURDATE() and CURDATE() <= eventEndDate)
ORDER BY lastname , firstname
