package postgres

import (
	"context"
	"fmt"

	"gitlab.jojoxd.nl/jojoxd/anistats/db/base"
	"gitlab.jojoxd.nl/jojoxd/anistats/db/entity"
	"gitlab.jojoxd.nl/jojoxd/anistats/db/internal/postgres/gen"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/config"
)

var _ base.TestRepository = (*TestRepository)(nil)

type TestRepository struct {
	queries *gen.Queries
}

func NewTestRepository(cfg config.DatabaseConfig) *TestRepository {
	return &TestRepository{
		queries: &gen.Queries{},
	}
}

func (r *TestRepository) GetTest(ctx context.Context, id int32) (*entity.Test, error) {
	test, err := r.queries.GetTest(ctx, id)
	if err != nil {
		return nil, err
	}

	out := entity.Test{
		Id: test.ID,
	}

	return &out, nil
}

func (r *TestRepository) ListTest(ctx context.Context) ([]*entity.Test, error) {
	return nil, fmt.Errorf("not implemented")
}

func (r *TestRepository) CreateTest(ctx context.Context, new entity.Test) error {
	return fmt.Errorf("not implemented")
}

func (r *TestRepository) DeleteTest(ctx context.Context, id int32) error {
	return fmt.Errorf("not implemented")
}
