-- name: GetActivity :one
SELECT
    a.*,
    COALESCE(
        la.type,
        lea.type,
        ua.type
    )                   AS type,
    la.list_id          AS list_id,
    lea.list_entry_id   AS list_entry_id
FROM activities a
LEFT JOIN list_activities la
    ON la.activity_id = a.id
        AND a.discriminator = 'list'
LEFT JOIN list_entry_activities lea
    ON lea.activity_id = a.id
        AND a.discriminator = 'list_entry'
LEFT JOIN user_activities ua
    ON ua.activity_id = a.id
        AND a.discriminator = 'user'
WHERE
    a.id = $1
;

-- name: CreateActivity :exec
INSERT INTO activities
    (id, discriminator, user_id)
VALUES
    ($1, $2, $3)
;

-- name: CreateListActivity :exec
INSERT INTO list_activities
    (activity_id, list_id, type)
VALUES
    ($1, $2, $3)
;

-- name: CreateListEntryActivity :exec
INSERT INTO list_entry_activities
(activity_id, list_entry_id, type)
VALUES
    ($1, $2, $3)
;

-- name: CreateUserActivity :exec
INSERT INTO user_activities
    (activity_id, type)
VALUES
    ($1, $2);

-- name: DeleteActivity :exec
DELETE FROM activities a
WHERE
    a.id = $1
;

-- name: DeleteActivitiesForUser :exec
DELETE FROM activities a
WHERE
    a.user_id = $1
;

-- name: CreateActivityMessage :exec
INSERT INTO activity_messages
    (id, activity_id, author_id, message)
VALUES
    ($1, $2, $3, $4)
;

-- name: GetActivityMessage :one
SELECT
    am.*
FROM activity_messages am
WHERE
    am.id = $1
;

-- name: ListActivityMessageForUser :many
SELECT
    am.*
FROM activity_messages am
WHERE
    am.author_id = $1
;

-- name: UpdateActivityMessage :exec
UPDATE activity_messages am
SET
    message = $2
WHERE
    am.id = $1
;

-- name: DeleteActivityMessage :exec
DELETE FROM activity_messages am
WHERE
    am.id = $1
;

-- name: DeleteActivityMessagesForUser :exec
DELETE FROM activity_messages am
WHERE
    am.author_id = $1
;