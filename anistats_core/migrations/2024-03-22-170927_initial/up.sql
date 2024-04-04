CREATE TABLE media (
    id UUID NOT NULL,
    anilist_id BIGINT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE list (
    id   UUID    NOT NULL,
    name VARCHAR NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE list_item (
    id       UUID NOT NULL,
    list_id  UUID NOT NULL REFERENCES list(id),
    media_id UUID NOT NULL REFERENCES media(id),

    -- @TODO: Add statuses here

    PRIMARY KEY (id)
);

CREATE TABLE translation (
    id UUID NOT NULL,
    media_id UUID NULL REFERENCES media(id),

    PRIMARY KEY (id)
);
