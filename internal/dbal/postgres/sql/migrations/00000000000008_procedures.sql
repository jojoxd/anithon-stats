-- +goose Up

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION updated_at()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
-- +goose StatementEnd

-- +goose Down
DROP FUNCTION updated_at;