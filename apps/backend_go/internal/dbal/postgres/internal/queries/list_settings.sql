-- name: GetListSettings :one
SELECT
	ls.*
FROM list_settings ls
WHERE
	id = $1
LIMIT 1
;

-- name: CreateListSettings :one
INSERT INTO list_settings (
	stack_size, allow_chunk_merge, max_chunk_length, max_chunk_join_length
) VALUES (
    $1, $2, $3, $4
) RETURNING *;

-- name: UpdateListSettings :exec
UPDATE list_settings
SET
	stack_size = $2,
	allow_chunk_merge = $3,
	max_chunk_length = $4,
	max_chunk_join_length = $5
WHERE
	id = $1
;

-- name: DeleteListSettings :exec
DELETE FROM list_settings ls
WHERE
	ls.id = $1
;
