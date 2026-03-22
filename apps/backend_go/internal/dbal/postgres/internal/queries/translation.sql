-- name: GetTranslation :many
SELECT
	tt.*
FROM translations_translation tt
WHERE
	tt.id = $1
;

-- name: CreateTranslation :one
INSERT INTO translations (
	id
) VALUES (
    uuidv7()
) RETURNING *;

-- name: SetTranslation :one
INSERT INTO translations_translation (
    id, locale, translation
) VALUES (
	$1, $2, $3
)
ON CONFLICT (id, locale) DO UPDATE
	SET translation = $3
RETURNING *;

-- name: DeleteTranslation :exec
DELETE FROM translations
WHERE
	id = $1
;

-- name: DeleteTranslationLocale :exec
DELETE FROM translations_translation
WHERE
	id = $1
AND locale = $2
;
