-- name: GetMedia :one
SELECT m.* FROM media m WHERE m.uuid = ?;

-- name: ListMedia :many
SELECT m.* FROM media m;

-- name: ListMediaP :many
SELECT m.* FROM media m LIMIT ? OFFSET ?;

-- name: CreateMedia :exec
INSERT INTO media (
    uuid,
    description,
    episodes_total,
    episodes_duration_seconds
) VALUES (?, ?, ?, ?);

-- name: DeleteMedia :exec
DELETE FROM media WHERE uuid = ?;
