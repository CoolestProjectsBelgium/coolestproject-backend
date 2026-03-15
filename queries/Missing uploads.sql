CREATE OR REPLACE VIEW `missing-uploads` AS
    SELECT 
        p.eventId AS EventId,
        p.id AS ProjectId,
        p.project_name AS project_name,
        t.name AS TableName,
        u.firstname AS firstname,
        u.lastname AS lastname,
        p.ownerId AS ownerId,
        u.email AS email,
        u.email_guardian AS email_guardian,
        u.language AS language
    FROM
        projects p
        JOIN users u ON u.id = p.ownerId
        LEFT JOIN attachments a ON p.id = a.ProjectId
        LEFT JOIN projecttables pt ON pt.ProjectId = p.id
        LEFT JOIN `tables` t ON pt.TableId = t.id
    WHERE
        p.eventId = (SELECT 
						events.id
					FROM
						events
					WHERE
						events.registrationClosedDate <= CURDATE() 
                        AND CURDATE() <= events.eventEndDate
                )
            AND a.name IS NULL
    ORDER BY u.lastname;
