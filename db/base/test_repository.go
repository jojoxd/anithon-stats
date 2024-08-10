package base

import (
	"context"

	"gitlab.jojoxd.nl/jojoxd/anistats/db/entity"
)

type TestRepository interface {
	GetTest(ctx context.Context, id int32) (*entity.Test, error)
	ListTest(ctx context.Context) ([]*entity.Test, error)
	CreateTest(ctx context.Context, test entity.Test) error
	DeleteTest(ctx context.Context, id int32) error
}
