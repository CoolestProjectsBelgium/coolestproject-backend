START TRANSACTION;

SELECT @eventIdNew := id FROM `events`
WHERE eventBeginDate <= CURDATE() and CURDATE() <= eventEndDate;
SET @eventIdOld = @eventIdNew - 1;

-- Eerst groups

INSERT INTO `TShirtGroups`
(
`name`,
`createdAt`,
`updatedAt`,
`eventId`)
SELECT 
    `name`,
    now(),
    now(),
    @eventIdNew 
FROM `TShirtGroups`
where eventid = @eventIdOld ;

SELECT * FROM `TShirtGroups` WHERE EventId = @eventIdNew;


-- 7 adult 8 kids (dus +3) <=== dat gaan we niet meer doen
-- Dan vertaal groups
INSERT INTO `tshirtgrouptranslations`
(
`language`,
`description`,
`createdAt`,
`updatedAt`,
`TShirtGroupId`,
`EventId`)
SELECT  
tgt.language, 
tgt.description, 
now(), 
now(), 
pn.Id, 
@eventIdNew 
FROM TShirtGroupTranslations tgt
inner join TShirtGroups po on tgt.TShirtGroupId = po.id -- parent old
inner join TShirtGroups pn on pn.name = po.name and pn.EventId = @eventIdNew  -- parent new
WHERE tgt.eventid = @eventIdOld 
;

SELECT * FROM  `tshirtgrouptranslations` WHERE EventId = @eventIdNew;


-- Dan TShirt maten
INSERT INTO `TShirts`
(
`name`,
`createdAt`,
`updatedAt`,
`eventId`,
`groupId`)
SELECT 
    t.`name`,
    now(),
    now(),
	@eventIdNew,
    pn.Id
FROM `TShirts` t
inner join TShirtGroups po on t.GroupId = po.id -- parent old
inner join TShirtGroups pn on pn.name = po.name and pn.EventId = @eventIdNew  -- parent new
WHERE t.eventId = @eventIdOld ;

SELECT * FROM  `TShirts` WHERE EventId = @eventIdNew;

-- Vertaal de maten
INSERT INTO `tshirttranslations`
(
`language`,
`description`,
`createdAt`,
`updatedAt`,
`TShirtId`,
`EventId`)
SELECT  
tt.language, 
tt.description,
now(), 
now(), 
pn.id, 
 @eventIdNew
FROM tshirttranslations tt
INNER JOIN TShirts po on tt.TShirtId = po.id -- parent old
INNER JOIN TShirts pn on pn.name = po.name and pn.EventId = @eventIdNew  -- parent new
WHERE tt.eventid = @eventIdOld ;

SELECT * FROM `tshirttranslations` WHERE EventId = @eventIdNew;

COMMIT;
-- ROLLBACK;
