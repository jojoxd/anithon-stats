package dbal

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
)

type Database interface {
	Open(ctx context.Context) error
	Close() error

	Migrate(ctx context.Context) error
	NewTransaction(ctx context.Context) (*sql.Tx, error)

	UserRepository() repository.User
	ListRepository() repository.List
	ListSettingsRepository() repository.ListSettings
	SeriesRepository() repository.Series
	TranslationRepository() repository.Translation
	EntryRepository() repository.Entry
	EntryDataRepository() repository.EntryData
}
