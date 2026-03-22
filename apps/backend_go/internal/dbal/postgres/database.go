package postgres

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"

	"github.com/pressly/goose/v3"
	sqldblogger "github.com/simukti/sqldb-logger"

	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal"
	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/dbal"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslogsql"

	_ "github.com/lib/pq"
)

var _ dbal.Database = (*Database)(nil)

type Database struct {
	config  config.Dbal
	conn    *sql.DB
	logger  *aslog.Logger
	queries *generated.Queries
}

func New(config config.Dbal, logger *aslog.Logger) *Database {
	return &Database{config: config, logger: logger, queries: nil}
}

func (d *Database) Open(ctx context.Context) error {
	conn, err := d.open(ctx)
	if err != nil {
		return err
	}

	queries, err := generated.Prepare(ctx, conn)
	if err != nil {
		return err
	}

	d.conn = conn
	d.queries = queries

	return nil
}

func (d *Database) open(ctx context.Context) (*sql.DB, error) {
	conn, err := sql.Open("postgres", d.config.Dsn)
	if err != nil {
		return nil, err
	}

	logAdapter := aslogsql.NewSlogAdapter(d.logger)
	conn = sqldblogger.OpenDriver(d.config.Dsn, conn.Driver(), logAdapter, logAdapter.Options()...)

	return conn, nil
}

func (d *Database) Close() error {
	if d.queries != nil {
		if err := d.queries.Close(); err != nil {
			return err
		}
	}

	if d.conn != nil {
		if err := d.conn.Close(); err != nil {
			return err
		}
	}

	return nil
}

func (d *Database) NewTransaction(ctx context.Context) (*sql.Tx, error) {
	return d.conn.BeginTx(ctx, &sql.TxOptions{
		Isolation: sql.LevelDefault,
		ReadOnly:  false,
	})
}

func (d *Database) Migrate(ctx context.Context) error {
	conn, err := d.open(ctx)
	if err != nil {
		return err
	}

	provider, err := goose.NewProvider(goose.DialectPostgres, conn, internal.Migrations())
	if err != nil {
		return err
	}

	defer provider.Close()

	first := true
	for {
		result, err := provider.UpByOne(ctx)

		if errors.Is(err, goose.ErrNoNextVersion) {
			if first {
				d.logger.Info("No migrations available")
			}

			break
		}

		first = false

		group := slog.Group("migration",
			slog.Any("direction", result.Direction),
			slog.Any("version", result.Source.Version),
			slog.Bool("empty", result.Empty),
		)

		if err != nil {
			d.logger.Error("failed migration",
				slog.Any("err", err),
				group,
			)

			return err
		}

		d.logger.Info("executed migration", group)
	}

	return nil
}

func (d *Database) UserRepository() repository.User {
	return &userRepository{d.logger, d.queries}
}

func (d *Database) ListRepository() repository.List {
	return &listRepository{logger: d.logger, queries: d.queries}
}

func (d *Database) ListSettingsRepository() repository.ListSettings {
	return &listSettingsRepository{logger: d.logger, queries: d.queries}
}

func (d *Database) SeriesRepository() repository.Series {
	return &seriesRepository{logger: d.logger, queries: d.queries}
}

func (d *Database) TranslationRepository() repository.Translation {
	return &translationRepository{logger: d.logger, queries: d.queries}
}

func (d *Database) EntryRepository() repository.Entry {
	return &entryRepository{logger: d.logger, queries: d.queries}
}

func (d *Database) EntryDataRepository() repository.EntryData {
	return &entryDataRepository{logger: d.logger, queries: d.queries}
}
