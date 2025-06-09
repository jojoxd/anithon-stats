-- +goose Up
CREATE TABLE users (
    uuid UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(uuid)
);

CREATE TABLE translations (
    uuid UUID NOT NULL,
    locale VARCHAR(32) NOT NULL,
    translation TEXT NOT NULL,
    PRIMARY KEY (uuid, locale)
);

CREATE TABLE media (
    uuid UUID NOT NULL,
    display_name UUID NOT NULL REFERENCES translations(uuid),
    description TEXT NOT NULL,
    episodes_total INTEGER NOT NULL,
    episodes_duration_seconds INTEGER NOT NULL,
    PRIMARY KEY(uuid)
);

CREATE TABLE user_lists (
    uuid UUID NOT NULL,
    user_uuid UUID NOT NULL,
    name VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (uuid),
    CONSTRAINT UQ_USER_LIST_NAME UNIQUE (user_uuid, name)
);

CREATE TABLE user_list_entries (
    list_uuid UUID NOT NULL REFERENCES user_lists(uuid),
    media_uuid UUID NOT NULL REFERENCES media(uuid),
    PRIMARY KEY (list_uuid, media_uuid),
    CONSTRAINT UQ_USER_LIST_MEDIA UNIQUE (list_uuid, media_uuid)
);

-- +goose Down
DROP TABLE user_list_entries;
DROP TABLE user_lists;
DROP TABLE media;
DROP TABLE translations;
DROP TABLE users;
