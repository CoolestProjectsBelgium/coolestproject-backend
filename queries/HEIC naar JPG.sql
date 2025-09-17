
INSERT INTO `voting`.`azureblobs`
(
`container_name`,
`blob_name`,
`size`,
`createdAt`,
`updatedAt`,
`AttachmentId`,
`EventId`)
SELECT container_name, replace(blob_name, '.HEIC', '.jpg'), size, createdAt, CURDATE(), AttachmentId, EventId
FROM voting.azureblobs
where blob_name like '%.heic' and EventId = 5;


INSERT INTO `voting`.`attachments`
(
`name`,
`confirmed`,
`internal`,
`createdAt`,
`updatedAt`,
`ProjectId`,
`filename`,
`EventId`)
SELECT  `name`, confirmed, internal, createdAt, CURDATE(), ProjectId, replace(filename, '.HEIC', '.jpg'), EventId
FROM voting.attachments
where filename like '%.heic' and EventId = 5 and id > 467;


SELECT b.* , a.id, c.id, c.name
FROM voting.azureblobs b 
inner join attachments a on b.AttachmentId = a.id
inner join attachments c on  c.ProjectId = a.ProjectId and c.name = a.name 
where b.updatedAt = '2025-04-18'
order by b.id;

-- EDIT:
SELECT * FROM voting.azureblobs;