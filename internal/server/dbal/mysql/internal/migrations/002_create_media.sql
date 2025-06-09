-- +goose Up
CREATE TABLE media (
    uuid BINARY(16) NOT NULL,
    description TEXT NOT NULL,
    episodes_total INTEGER NOT NULL,
    episodes_duration_seconds INTEGER NOT NULL,
    PRIMARY KEY(uuid)
)

-- +goose Down
DROP TABLE media;