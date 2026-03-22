package dbal

import (
	"fmt"

	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/dbal"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

func New(cfg config.Dbal, logger *aslog.Logger) (dbal.Database, error) {
	switch cfg.Type() {
	case config.DbalTypePostgres:
		return postgres.New(cfg, logger), nil

	case config.DbalTypeMySQL:
		return nil, fmt.Errorf("mysql: not implemented")

	case config.DbalTypeSqlite:
		return nil, fmt.Errorf("sqlite: not implemented")
	}

	return nil, fmt.Errorf("unknown dbal.Type: %v", cfg.Type())
}
