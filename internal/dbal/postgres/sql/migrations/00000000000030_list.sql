-- +goose Up
CREATE TABLE lists(
    id          uuid PRIMARY KEY,
    user_id     uuid NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(64) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
        DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL
        DEFAULT now()
);

CREATE TRIGGER list_updated_at
    BEFORE UPDATE ON lists
FOR EACH ROW
    EXECUTE PROCEDURE updated_at()
;

CREATE TABLE list_entries(
    id                  uuid PRIMARY KEY,
    list_id             uuid NOT NULL
        REFERENCES lists(id) ON DELETE CASCADE,
    media_id            uuid NOT NULL
        REFERENCES media(id) ON DELETE CASCADE,
    episodes_watched    INT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
        DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL
        DEFAULT now()
);

CREATE TRIGGER list_entries_updated_at
    BEFORE UPDATE ON list_entries
FOR EACH ROW
    EXECUTE PROCEDURE updated_at()
;

CREATE TABLE list_settings (
    list_id uuid NOT NULL
        REFERENCES lists(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX list_settings_id
    ON list_settings(list_id);

CREATE TABLE list_entry_settings (
    list_id uuid NOT NULL
        REFERENCES list_entries(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX list_entry_settings_id
    ON list_entry_settings(list_id);

-- +goose Down


DROP TABLE list_entry_settings;

DROP TRIGGER list_entries_updated_at ON list_entries;

DROP TABLE list_entries;

DROP TABLE list_settings;

DROP TRIGGER list_updated_at ON lists;

DROP TABLE lists;
