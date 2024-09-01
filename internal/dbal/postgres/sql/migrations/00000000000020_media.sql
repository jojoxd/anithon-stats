-- +goose Up
CREATE TABLE media (
    id                      uuid PRIMARY KEY,
    episode_total           INT NOT NULL,
    episode_length_minutes  INT NOT NULL
);

CREATE TABLE media_external_ident (
    media_id    uuid NOT NULL
        REFERENCES media(id),
    source      VARCHAR(16) NOT NULL,
    source_id   VARCHAR(64) NOT NULL
);

CREATE UNIQUE INDEX uq_media_source
    ON media_external_ident(media_id, source);

CREATE TABLE media_translation (
    media_id        uuid NOT NULL
        REFERENCES media(id),
    language_code   VARCHAR(16) NOT NULL,
    translation     TEXT NOT NULL
);

CREATE UNIQUE INDEX uq_media_translation_language
    ON media_translation(media_id, language_code);

-- +goose Down
DROP INDEX uq_media_translation_language;

DROP TABLE media_translation;

DROP INDEX uq_media_source;

DROP TABLE media_external_ident;

DROP TABLE media;
