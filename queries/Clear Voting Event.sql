SELECT @eventid := id FROM voting.events
WHERE eventBeginDate <= CURDATE() and CURDATE() <= eventEndDate
;

SELECT COUNT(*) as PublicVotes
FROM publicvotes pv
INNER JOIN projects p on pv.projectId = p.id
WHERE p.eventid = @eventid;

SELECT COUNT(*) as JuryVotes
FROM votes v
inner join projects p on v.projectId = p.id
where p.eventid = @eventid;

DELETE pv.*
FROM publicvotes pv
inner join projects p on pv.projectId = p.id
where p.eventid = @eventid;

DELETE v.*
FROM votes v
inner join projects p on v.projectId = p.id
where p.eventid = @eventid;
