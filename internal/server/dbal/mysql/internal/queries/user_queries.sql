-- name: GetUser :one
SELECT u.* FROM users u WHERE u.uuid = ?;

-- name: ListUsers :many
SELECT u.* FROM users u;

-- name: ListUsersP :many
SELECT u.* FROM users u LIMIT ? OFFSET ?;

-- name: CreateUser :exec
INSERT INTO users (uuid, name) VALUES (?, ?);

-- name: DeleteUser :exec
DELETE FROM users WHERE uuid = ?;
