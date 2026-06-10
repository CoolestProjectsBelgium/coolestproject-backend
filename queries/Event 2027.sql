/****************
 * Do not forget to create a new container 
 * in Azure Storage (Test, then Prod)
 ***************/

START TRANSACTION;

SELECT * FROM events;

UPDATE events
SET  eventEndDate = DATE('2026-06-09')
WHERE id = 6;


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
(7,
'coolestproject27',
7,
18,
16,
64,
3,
DATE('2027-03-13'), -- officialStartDate
'Coolest Projects 2027',
CURRENT_TIMESTAMP(),
CURRENT_TIMESTAMP(),
2*1024*1024*1024, -- 2 GB
DATE('2026-06-10'), -- eventBeginDate
DATE('2026-06-11'), -- registrationOpenDate
DATE('2027-01-22'),  -- registrationClosedDate
DATE('2027-03-01'), -- projectClosedDate
DATE('2027-06-15') -- eventEndDate
);

SELECT * FROM events;

-- ROLLBACK;
COMMIT;
