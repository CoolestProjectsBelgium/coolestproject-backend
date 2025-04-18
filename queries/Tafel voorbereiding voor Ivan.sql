SELECT 
	    `u`.`id` AS `user_id`,
        `u`.`firstname` AS `firstname`,
        `u`.`lastname` AS `lastname`,
        `u`.`language` AS `language`,
        `u`.`sex` AS `sex`,
        `t`.`name` AS `TShirt`,
        (CASE
            WHEN (`ph`.`Agree` IS NULL) THEN 'NO PHOTO'
            ELSE ''
        END) AS `Photo`,
        `p`.`id` AS `Project_id`,
        `p`.`project_name` AS `project_name`,
        `ta`.`name` AS `TableName`,
        `u`.`medical` AS `medical`,
        `u`.`via` AS `via`,
        `u`.`email` AS `email`,
        `u`.`gsm` AS `gsm`,
        `u`.`gsm_guardian` AS `gsm_guardian`,
        `u`.`email_guardian` AS `email_guardian`
    FROM
        ((((((`users` `u`
        JOIN `tshirts` `t` ON ((`t`.`id` = `u`.`sizeId`)))
        LEFT JOIN `vouchers` `v` ON ((`u`.`id` = `v`.`participantId`)))
        LEFT JOIN `projects` `p` ON (((`p`.`ownerId` = `u`.`id`)
            OR (`p`.`id` = `v`.`projectId`))))
        LEFT JOIN `projecttables` `pt` ON ((`pt`.`ProjectId` = `p`.`id`)))
        LEFT JOIN `tables` `ta` ON ((`ta`.`id` = `pt`.`TableId`)))
        LEFT JOIN (SELECT 
            `qu`.`UserId` AS `UserId`,
                `q`.`name` AS `Agree`,
                `qu`.`EventId` AS `eventid`
        FROM
            (`questionusers` `qu`
        JOIN `questions` `q` ON (((`qu`.`QuestionId` = `q`.`id`)
            AND (`q`.`name` LIKE '%photo%'))))) `ph` ON (((`u`.`id` = `ph`.`UserId`)
            AND (`ph`.`eventid` = `u`.`eventId`))))
    WHERE
        (`u`.`eventId` = (SELECT 
                `events`.`id`
            FROM
                `events`
            WHERE
                ((`events`.`registrationClosedDate` <= CURDATE())
                    AND (CURDATE() <= `events`.`eventEndDate`))))
    ORDER BY `u`.`lastname` , `u`.`firstname`