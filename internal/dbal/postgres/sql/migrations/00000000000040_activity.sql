-- +goose Up
CREATE TABLE activities (
    id              uuid PRIMARY KEY,
    discriminator   VARCHAR(32) NOT NULL,
    user_id         uuid NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL
        DEFAULT now()
);

CREATE TABLE activity_messages (
    id          uuid PRIMARY KEY,
    activity_id uuid NOT NULL
        REFERENCES activities(id) ON DELETE CASCADE,
    author_id   uuid NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
        DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL
        DEFAULT now()
);

CREATE TRIGGER activity_messages_updated_at
    BEFORE UPDATE ON activity_messages
FOR EACH ROW
    EXECUTE PROCEDURE updated_at()
;

CREATE TABLE list_activities (
    activity_id uuid NOT NULL
        REFERENCES activities(id) ON DELETE CASCADE,
    list_id     uuid NOT NULL
        REFERENCES lists(id) ON DELETE CASCADE,
    type        VARCHAR(32) NOT NULL
);

CREATE TABLE list_entry_activities (
    activity_id     uuid NOT NULL
        REFERENCES activities(id) ON DELETE CASCADE,
    list_entry_id   uuid NOT NULL
        REFERENCES list_entries(id) ON DELETE CASCADE,
    type            VARCHAR(32) NOT NULL
);

CREATE TABLE user_activities (
    activity_id uuid NOT NULL
        REFERENCES activities(id) ON DELETE CASCADE,
    type        VARCHAR(32) NOT NULL
);

-- +goose Down
DROP TRIGGER activity_messages_updated_at ON activity_messages;

DROP TABLE user_activities;

DROP TABLE list_entry_activities;

DROP TABLE list_activities;

DROP TABLE activity_messages;

DROP TABLE activities;