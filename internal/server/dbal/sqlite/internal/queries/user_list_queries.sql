-- name: GetUserList :one
SELECT ul.* from user_lists ul WHERE ul.uuid = ?;

-- name: GetUserLists :many
SELECT ul.* FROM user_lists ul;

-- name: GetUserListsP :many
SELECT ul.* FROM user_lists ul LIMIT ? OFFSET ?;

-- name: CreateUserList :exec
INSERT INTO user_lists
    (uuid, user_uuid, name, description)
VALUES (?, ?, ?, ?);

-- name: UpdateUserList :exec
UPDATE user_lists
SET
    name = ?,
    description = ?
WHERE
    uuid = ?
;

-- name: DeleteUserList :exec
DELETE FROM user_lists
WHERE
    uuid = ?
;

-- name: AddUserListEntry :exec
INSERT INTO user_list_entries
    (uuid, userlist_uuid, media_uuid)
VALUES (?, ?, ?);

-- name: GetUserListEntry :one
SELECT
    ule.*
FROM user_list_entries ule
WHERE
    ule.uuid = ?
;

-- name: GetUserListEntries :many
SELECT
    ule.*
FROM user_list_entries ule
WHERE
    ule.userlist_uuid = ?
;

-- name: GetUserListEntriesP :many
SELECT
    ule.*
FROM user_list_entries ule
WHERE
    ule.userlist_uuid = ?
LIMIT ?
OFFSET ?
;

-- name: UpdateUserListEntry :exec
UPDATE user_list_entries
SET
    media_uuid = ?
WHERE
    uuid = ?
;

-- name: DeleteUserListEntry :exec
DELETE FROM user_list_entries
WHERE
    uuid = ?
;
