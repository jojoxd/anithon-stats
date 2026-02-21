package dbal

import (
	"context"
)

type Database interface {
	Migrate(ctx context.Context) error

	UserRepository(ctx context.Context) (UserRepository, error)
	UserListRepository(ctx context.Context) (UserListRepository, error)
	MediaRepository(ctx context.Context) (MediaRepository, error)
}
