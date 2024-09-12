-- name: GetUser :one
SELECT
    u.*
FROM
    users u
WHERE
    u.id = $1
;

-- name: ListUsers :many
SELECT
    u.*
FROM users u;

-- name: SearchUsers :many
SELECT
    u.*
FROM
    users u
WHERE
    u.name LIKE CONCAT('%', $1::text, '%')
;

-- name: CreateUser :execresult
INSERT INTO users
    (id, name, password_hash)
VALUES
    ($1, $2, $3)
RETURNING id;
;

-- name: UpdateUser :exec
UPDATE users
SET
    password_hash = $2
WHERE
    id = $1
;

-- name: DeleteUser :exec
DELETE FROM users u
WHERE
    u.id = $1
;