package sqlite

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"path/filepath"

	"github.com/pressly/goose/v3"
	"github.com/simukti/sqldb-logger"

	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/internal/logging"
	"anistats/internal/server/dbal/sqlite/internal"
	"anistats/internal/server/dbal/sqlite/internal/generated"

	_ "github.com/mattn/go-sqlite3"
)

var _ dbal.Database = (*Database)(nil)

type Database struct {
	logger *slog.Logger
	conn   *sql.DB
}

func New(config Config, logger *slog.Logger) (*Database, error) {
	conn, err := sql.Open("sqlite3", config.Path)
	if err != nil {
		return nil, err
	}

	logAdapter := logging.NewSlogAdapter(logger)
	conn = sqldblogger.OpenDriver(config.Path, conn.Driver(), logAdapter)

	db := &Database{
		logger: logger,
		conn:   conn,
	}

	return db, nil
}

func (d Database) Migrate(ctx context.Context) error {
	provider, err := goose.NewProvider("sqlite3", d.conn, internal.Migrations())
	if err != nil {
		return err
	}

	hasPending, err := provider.HasPending(ctx)
	if err != nil || !hasPending {
		return err
	}

	d.logger.Info("executing migrations")

	for {
		result, err := provider.UpByOne(ctx)
		if err != nil {
			if errors.Is(err, goose.ErrNoNextVersion) {
				break
			}

			return err
		}

		d.logger.Info("executed migration", slog.Group("migration",
			slog.String("file", filepath.Base(result.Source.Path)),
			slog.Duration("duration", result.Duration),
		))
	}

	d.logger.Info("executed all migrations")

	return nil
}

func (d Database) UserRepository(ctx context.Context) (dbal.UserRepository, error) {
	queries, err := generated.Prepare(ctx, d.conn)
	if err != nil {
		return nil, err
	}

	return NewUserRepository(queries), nil
}

func (d Database) MediaRepository(ctx context.Context) (dbal.MediaRepository, error) {
	queries, err := generated.Prepare(ctx, d.conn)
	if err != nil {
		return nil, err
	}

	return NewMediaRepository(queries), nil
}
