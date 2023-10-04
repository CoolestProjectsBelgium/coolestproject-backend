START TRANSACTION;

SELECT @eventIdNew := id FROM `events`
WHERE eventBeginDate <= CURDATE() and CURDATE() <= eventEndDate;
SET @eventIdOld = @eventIdNew - 1;

INSERT INTO Questions 
(`name`, `mandatory`, `createdAt`, `updatedAt`, `EventId`) 
SELECT     
`name`,  `mandatory`,       now(),       now(),  @eventIdNew  
FROM `Questions`  where eventid = @eventIdOld;


INSERT INTO `QuestionTranslations`
(
`language`,
`description`,
`positive`,
`negative`,
`createdAt`,
`updatedAt`,
`QuestionId`,
`EventId`)
SELECT 
    qto.language,
    qto.description,
    qto.positive,
    qto.negative,
    now(),
    now(),
    pn.id,
    @eventIdNew 
FROM `QuestionTranslations` qto
inner join `Questions` po on qto.QuestionId = po.id -- parent old
inner join `Questions` pn on pn.name = po.name and pn.EventId = @eventIdNew  -- parent new
where qto.eventid = @eventIdOld;

COMMIT;
