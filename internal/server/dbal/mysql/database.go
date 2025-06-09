package mysql

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"

	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/mysql/internal"

	_ "github.com/go-sql-driver/mysql"
)

var _ dbal.Database = (*Database)(nil)

type Database struct {
	conn *sql.DB
}

func New(config Config) (*Database, error) {
	conn, err := sql.Open("mysql", config.Dsn)
	if err != nil {
		return nil, err
	}

	db := &Database{
		conn: conn,
	}

	return db, nil
}

func (d Database) Migrate(ctx context.Context) ([]*goose.MigrationResult, error) {
	provider, err := goose.NewProvider("mysql", d.conn, internal.Migrations())
	if err != nil {
		return nil, err
	}

	return provider.Up(ctx)
}

func (d Database) UserRepository(ctx context.Context) (dbal.UserRepository, error) {
	// TODO implement me
	panic("implement me")
}
