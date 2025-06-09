package dbal

import (
	"context"
)

type Database interface {
	Migrate(ctx context.Context) error

	UserRepository(ctx context.Context) (UserRepository, error)
	MediaRepository(ctx context.Context) (MediaRepository, error)
}
