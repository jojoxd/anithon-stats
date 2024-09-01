-- name: GetList :one
SELECT
    sqlc.embed(ls),
    l.*
FROM
    lists l
LEFT JOIN list_settings ls
    ON ls.list_id = l.id
WHERE
    l.id = $1
;

-- name: GetUserLists :many
SELECT
    sqlc.embed(ls),
    l.*
FROM
    lists l
LEFT JOIN list_settings ls
    ON ls.list_id = l.id
WHERE
    l.user_id = $1
;

-- name: SearchLists :many
SELECT
    sqlc.embed(ls),
    l.*
FROM
    lists l
LEFT JOIN list_settings ls
    ON ls.list_id = l.id
WHERE
    l.name LIKE $1
;

-- name: SearchUserLists :many
SELECT
    sqlc.embed(ls),
    l.*
FROM
    lists l
INNER JOIN list_settings ls
    ON ls.list_id = l.id
WHERE
    l.user_id = $1
AND
    l.name LIKE $2
;

-- name: CreateList :execresult
INSERT INTO lists
    (id, user_id, name)
VALUES
    ($1, $2, $3)
RETURNING id;

-- name: UpdateList :exec
UPDATE lists
SET
    name = $2
WHERE
    id = $1
;

-- name: DeleteList :exec
DELETE FROM lists l
WHERE
    l.id = $1
;