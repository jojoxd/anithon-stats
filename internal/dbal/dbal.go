package dbal

import (
	"database/sql"
	"fmt"
	"log/slog"
	"net/url"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"
	sqldblogger "github.com/simukti/sqldb-logger"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/logging/sqldb_logadapter"
)

func New(cfg *config.DatabaseConfig) (*sql.DB, error) {
	slog.Debug("Initializing database")

	uri, err := url.Parse(cfg.Dsn)
	if err != nil {
		return nil, err
	}

	driverName, dataSourceName := "", ""

	switch uri.Scheme {
	case "postgres":
		driverName, dataSourceName = "pgx", parsePostgres(uri)
	default:
		return nil, fmt.Errorf("unsupported database schema: %s", uri.Scheme)
	}

	db, err := sql.Open(driverName, dataSourceName)
	if err != nil {
		return nil, err
	}

	db = sqldblogger.OpenDriver(
		cfg.Dsn,
		db.Driver(),
		sqldb_logadapter.New(
			slog.Default(),
		),
		sqldblogger.WithExecerLevel(sqldblogger.LevelDebug),
		sqldblogger.WithPreparerLevel(sqldblogger.LevelDebug),
		sqldblogger.WithQueryerLevel(sqldblogger.LevelDebug),
	)

	db.Ping()

	return db, nil
}

func parsePostgres(uri *url.URL) string {
	dataSourceName := strings.Builder{}

	if username := uri.User.Username(); username != "" {
		dataSourceName.WriteString(fmt.Sprintf("username=%s ", username))
	}

	if password, hasPassword := uri.User.Password(); hasPassword {
		dataSourceName.WriteString(fmt.Sprintf("password=%s ", password))
	}

	if host := uri.Host; host != "" {
		dataSourceName.WriteString(fmt.Sprintf("host=%s ", host))
	}

	if port := uri.Port(); port != "" {
		dataSourceName.WriteString(fmt.Sprintf("port=%s ", port))
	}

	database := strings.TrimLeft(dataSourceName.String(), "/")
	if database == "" {
		if strings.Contains(database, "/") {
			panic(fmt.Sprintf("Invalid database: '%s'", database))
		}

		dataSourceName.WriteString(fmt.Sprintf("database=%s ", database))
	}

	return dataSourceName.String()
}
