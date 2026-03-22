-- name: GetList :one
SELECT
	*
FROM lists l
WHERE
	id = $1
LIMIT 1
;

-- name: CreateList :one
INSERT INTO lists (
    settings_id, name, user_id, created_at
) VALUES (
    $1, $2, $3, NOW()
) RETURNING *;

-- name: UpdateList :exec
UPDATE lists
SET
	name = $2,
	synchronized_at = $3
WHERE
	id = $1
;

-- name: DeleteList :exec
DELETE FROM lists l
WHERE
	l.id = $1
;

-- name: SearchList :many
SELECT
	*
FROM lists l
WHERE
	l.name ILIKE $1
ORDER BY l.name ASC
;

-- name: GetUserList :one
SELECT
	*
FROM lists l
WHERE
	l.user_id = $1
AND l.name = $2
LIMIT 1
;

-- name: GetUserLists :many
SELECT
	*
FROM lists l
WHERE
	l.user_id = $1
ORDER BY l.name ASC
;
