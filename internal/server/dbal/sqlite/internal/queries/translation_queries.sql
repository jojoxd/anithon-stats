-- name: CreateTranslation :exec
INSERT INTO translations
    (uuid, locale, translation)
VALUES
    (?, ?, ?);

-- name: GetTranslation :one
SELECT
    t.*
FROM
    translations t
WHERE
    t.uuid = ?
AND t.locale = ?;

-- name: GetTranslations :many
SELECT
    t.*
FROM
    translations t
WHERE
    t.uuid = ?;

-- name: DeleteTranslationL :exec
DELETE FROM translations
WHERE
    uuid = ?
AND locale = ?;

-- name: DeleteTranslation :exec
DELETE FROM translations
WHERE
    uuid = ?;
