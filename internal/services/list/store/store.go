package store

import (
	"database/sql"

	"github.com/jackc/pgx/v5/stdlib"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/list"
)

func New(db *sql.DB) list.Repository {
	switch db.Driver().(type) {
	case *stdlib.Driver:
		return NewPostgres(db)
	}

	panic("Invalid driver")
}
