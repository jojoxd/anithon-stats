package mysql

import (
	"context"
	"database/sql"
	"log/slog"

	sqldblogger "github.com/simukti/sqldb-logger"

	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/internal/logging"

	_ "github.com/go-sql-driver/mysql"
)

var _ dbal.Database = (*Database)(nil)

type Database struct {
	conn *sql.DB
}

func New(config Config, logger *slog.Logger) (*Database, error) {
	conn, err := sql.Open("mysql", config.Dsn)
	if err != nil {
		return nil, err
	}

	logAdapter := logging.NewSlogAdapter(logger)
	conn = sqldblogger.OpenDriver(config.Dsn, conn.Driver(), logAdapter)

	db := &Database{
		conn: conn,
	}

	return db, nil
}

func (d Database) Migrate(ctx context.Context) error {
	// provider, err := goose.NewProvider("mysql", d.conn, internal.Migrations())
	// if err != nil {
	// 	return nil, err
	// }
	//
	// return provider.Up(ctx)

	// TODO implement me
	panic("implement me")
}

func (d Database) UserRepository(ctx context.Context) (dbal.UserRepository, error) {
	// TODO implement me
	panic("implement me")
}

func (d Database) MediaRepository(ctx context.Context) (dbal.MediaRepository, error) {
	// TODO implement me
	panic("implement me")
}
