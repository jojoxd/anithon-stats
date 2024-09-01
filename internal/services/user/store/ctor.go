package store

import (
	"database/sql"

	"github.com/jackc/pgx/v5/stdlib"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user"
)

func New(db *sql.DB) user.Repository {
	switch db.Driver().(type) {
	case *stdlib.Driver:
		return NewPostgres(db)
	}

	panic("Invalid driver")
}
