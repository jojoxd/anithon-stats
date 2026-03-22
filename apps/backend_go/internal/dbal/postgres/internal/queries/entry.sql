-- name: GetEntry :one
SELECT
	*
FROM entries e
WHERE
	id = $1
LIMIT 1
;

-- name: GetEntryByAnilistId :one
SELECT
	*
FROM entries e
WHERE
	anilist_id = $1
;

-- name: GetEntryByListAndSeriesId :one
SELECT
	*
FROM entries e
WHERE
	list_id = $1
AND series_id = $2
LIMIT 1;

-- name: CreateEntry :one
INSERT INTO entries (
	list_id, series_id, data_id, custom_sequel_entry_id, anilist_id, state, progress
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- name: UpdateEntry :exec
UPDATE entries
SET
	series_id = $2,
	custom_sequel_entry_id = $3,
	anilist_id = $4,
	state = $5,
	progress = $6
WHERE
	id = $1
;

-- name: DeleteEntry :exec
DELETE FROM entries
WHERE
	id = $1
;

-- name: GetListEntries :many
SELECT
	*
FROM entries e
WHERE
	e.list_id = $1
;
