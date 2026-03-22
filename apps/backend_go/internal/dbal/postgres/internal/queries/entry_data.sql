-- name: GetEntryData :one
SELECT
	*
FROM entry_data ed
WHERE
	ed.id = $1
LIMIT 1
;

-- name: CreateEntryData :one
INSERT INTO entry_data (
	mult, "order", start_at, split, split_sequel_entry
) VALUES (
	$1, $2, $3, $4, $5
) RETURNING *;

-- name: UpdateEntryData :exec
UPDATE entry_data
SET
	mult = $2,
	"order" = $3,
	start_at = $4,
	split = $5,
	split_sequel_entry = $6
WHERE
	id = $1
;

-- name: DeleteEntryData :exec
DELETE FROM entry_data
WHERE
	id = $1
;
