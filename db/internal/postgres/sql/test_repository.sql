-- name: GetTest :one
SELECT 
    *
FROM test
WHERE
    id = $1
LIMIT 1;

-- name: ListTest :many
SELECT
    *
FROM test
ORDER BY id;

-- name: CreateTest :execresult
INSERT INTO test (
    test
) VALUES (
    $1
);

-- name: DeleteTest :exec
DELETE FROM test
WHERE
    id = $1
;
