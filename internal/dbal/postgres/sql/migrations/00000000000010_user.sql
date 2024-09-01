-- +goose Up
CREATE TABLE users (
    id              uuid PRIMARY KEY,
    name            VARCHAR(64) NOT NULL,
    password_hash   VARCHAR(32) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
        DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL
        DEFAULT now()
);

CREATE UNIQUE INDEX uq_user_name
    ON users(name);

CREATE TABLE user_external_idents (
    user_id     uuid NOT NULL
        REFERENCES users(id),
    source      VARCHAR(16) NOT NULL,
    source_id   VARCHAR(64) NOT NULL
);

CREATE UNIQUE INDEX uq_user_source
    ON user_external_idents(user_id, source);

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
FOR EACH ROW
    EXECUTE PROCEDURE updated_at()
;

-- +goose Down
DROP TRIGGER users_updated_at ON users;

DROP INDEX uq_user_source;

DROP TABLE user_external_idents;

DROP INDEX uq_user_name;

DROP TABLE users;
