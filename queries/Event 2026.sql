/****************
 * Do not forget to create a new container 
 * in Azure Storage (Test, then Prod)
 ***************/

START TRANSACTION;

SELECT * FROM events;

UPDATE events
SET  eventEndDate = DATE('2025-08-20')
WHERE id = 5;


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
(6,
'coolestproject26',
7,
18,
16,
90, -- Temporary fix for error in counting projects
3,
DATE('2026-03-14'), -- officialStartDate
'Coolest Projects 2026',
CURRENT_TIMESTAMP(),
CURRENT_TIMESTAMP(),
2*1024*1024*1024, -- 2 GB
DATE('2025-08-24'), -- eventBeginDate
DATE('2025-09-15'), -- registrationOpenDate
DATE('2026-02-22'),  -- registrationClosedDate
DATE('2026-03-01'), -- projectClosedDate
DATE('2026-08-15') -- eventEndDate
);

SELECT * FROM events;

-- ROLLBACK;
COMMIT;
