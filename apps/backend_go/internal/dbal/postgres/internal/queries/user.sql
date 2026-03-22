-- name: GetUser :one
SELECT
	u.*
FROM users u
WHERE
	u.id = $1
LIMIT 1
;

-- name: GetUserByAnilistId :one
SELECT
	u.*
FROM users u
WHERE
	u.anilist_id = $1
LIMIT 1
;

-- name: FindUserByName :one
SELECT
	u.*
FROM users u
WHERE
	u.name = $1
LIMIT 1
;

-- name: CreateUser :one
INSERT INTO users (
	anilist_id, name, avatar_url, created_at
) VALUES (
	$1, $2, $3, NOW()
) RETURNING *;

-- name: UpdateUser :exec
UPDATE users
SET
	anilist_id = $2,
	name = $3,
	avatar_url = $4
WHERE
	id = $1
;

-- name: DeleteUser :exec
DELETE FROM users
WHERE
	id = $1
;
