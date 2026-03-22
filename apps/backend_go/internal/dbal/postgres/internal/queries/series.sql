-- name: GetSeries :one
SELECT
	s.*
FROM series s
WHERE
	s.id = $1
LIMIT 1
;

-- name: GetSeriesByAnilistId :one
SELECT
	s.*
FROM series s
WHERE
	s.anilist_id = $1
LIMIT 1
;

-- name: CreateSeries :one
INSERT INTO series (
	anilist_id, title_translation_id, cover_image_url, duration, episodes, description, created_at
) VALUES (
    $1, $2, $3, $4, $5, $6, NOW()
) RETURNING *;

-- name: UpdateSeries :exec
UPDATE series
SET
	anilist_id = $2,
	title_translation_id = $3,
	cover_image_url = $4,
	duration = $5,
	episodes = $6,
	description = $7,
	synchronized_at = $8
WHERE
	id = $1
;

-- name: DeleteSeries :exec
DELETE FROM series
WHERE
	id = $1
;
