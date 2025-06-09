-- +goose Up
CREATE TABLE users (
    uuid BINARY(16) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(uuid)
);

-- +goose Down
DROP TABLE users;
