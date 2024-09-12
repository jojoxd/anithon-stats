package store

import (
	"database/sql"

	"github.com/jackc/pgx/v5/stdlib"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/activity"
)

func New(db *sql.DB) activity.Repository {
	switch db.Driver().(type) {
	case *stdlib.Driver:
		return NewPostgres(db)
	}

	panic("Invalid driver")
}
