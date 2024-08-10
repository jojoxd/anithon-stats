package factory

import (
	"gitlab.jojoxd.nl/jojoxd/anistats/db/base"
	"gitlab.jojoxd.nl/jojoxd/anistats/db/internal/postgres"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
)

func NewTestRepository(cfg config.DatabaseConfig) base.TestRepository {
	return postgres.NewTestRepository(cfg)
}
