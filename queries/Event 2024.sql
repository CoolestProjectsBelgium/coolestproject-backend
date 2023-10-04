/****************
 * Do not forget to create a new container 
 * in Azure Storage (Test, then Prod)
 ***************/

START TRANSACTION;

SELECT * FROM events;

INSERT INTO `events`
(`id`,
`azure_storage_container`,
`minAge`,
`maxAge`,
`minGuardianAge`,
`maxRegistration`,
`maxVoucher`,
`officialStartDate`,
`event_title`,
`createdAt`,
`updatedAt`,
`maxFileSize`,
`eventBeginDate`,
`registrationOpenDate`,
`registrationClosedDate`,
`projectClosedDate`,
`eventEndDate`)
VALUES
(4,
'coolestproject24',
7,
18,
16,
64,
3,
DATE('2024-04-20'), -- officialStartDate
'Coolest Projects 2024',
CURRENT_TIMESTAMP(),
CURRENT_TIMESTAMP(),
2*1024*1024*1024, -- 2 GB
DATE('2023-10-01'), -- eventBeginDate
DATE('2023-11-01'), -- registrationOpenDate
DATE('2024-04-01'),  -- registrationClosedDate
DATE('2024-04-08'), -- projectClosedDate
DATE('2024-08-31') -- eventEndDate
);

SELECT * FROM events;

-- ROLLBACK;
COMMIT;
