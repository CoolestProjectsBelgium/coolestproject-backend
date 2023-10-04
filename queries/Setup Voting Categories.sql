START TRANSACTION;

SELECT @eventIdNew := id FROM `events`
WHERE eventBeginDate <= CURDATE() and CURDATE() <= eventEndDate;
SET @eventIdOld = @eventIdNew - 1;

-- Name contains the year!
SET @old = CAST(YEAR(now()) as CHAR);
SET @new = CAST(YEAR(now())+1 as CHAR);
select @old, @new;

INSERT INTO votecategories
(
`name`,
min,
max,
public,
createdAt,
updatedAt,
eventId,
`optional`)
SELECT 
REPLACE(name, @old, @new),
min,
max,
public,
now(),
now(),
@eventIdNew ,
optional
FROM votecategories 
where eventid = @eventIdOld  -- Previous event
order by name
;

SELECT * FROM votecategories where eventid = @eventIdNew;

-- ROLLBACK;
COMMIT;
