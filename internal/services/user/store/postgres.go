package store

import (
	"context"

	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/dbal/postgres"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/user"
)

type postgresRepo struct {
	queries *postgres.Queries
}

func NewPostgres(db postgres.DBTX) user.Repository {
	return &postgresRepo{postgres.New(db)}
}

func (r postgresRepo) Get(ctx context.Context, id uuid.UUID) (user.User, error) {
	model, err := r.queries.GetUser(ctx, id)
	if err != nil {
		return user.User{}, err
	}

	out := user.User{
		Id:           model.Id,
		Name:         model.Name,
		PasswordHash: model.PasswordHash,
		CreatedAt:    model.CreatedAt,
		UpdatedAt:    model.UpdatedAt,
	}

	return out, nil
}

func (r postgresRepo) List(ctx context.Context) ([]user.User, error) {
	models, err := r.queries.ListUsers(ctx)
	if err != nil {
		return nil, err
	}

	out := make([]user.User, len(models))
	for i, model := range models {
		out[i] = user.User{
			Id:           model.Id,
			Name:         model.Name,
			PasswordHash: model.PasswordHash,
			CreatedAt:    model.CreatedAt,
			UpdatedAt:    model.UpdatedAt,
		}
	}

	return out, nil
}

func (r postgresRepo) Search(ctx context.Context, query string) ([]user.User, error) {
	models, err := r.queries.SearchUsers(ctx, query)
	if err != nil {
		return nil, err
	}

	out := make([]user.User, len(models))
	for i, model := range models {
		out[i] = user.User{
			Id:           model.Id,
			Name:         model.Name,
			PasswordHash: model.PasswordHash,
			CreatedAt:    model.CreatedAt,
			UpdatedAt:    model.UpdatedAt,
		}
	}

	return out, nil
}

func (r postgresRepo) Create(ctx context.Context, user user.CreateUser) (uuid.UUID, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.Nil, err
	}

	args := postgres.CreateUserParams{
		Id:           id,
		Name:         user.Name,
		PasswordHash: user.PasswordHash,
	}

	_, err = r.queries.CreateUser(ctx, args)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r postgresRepo) Update(ctx context.Context, id uuid.UUID, user user.UpdateUser) error {
	args := postgres.UpdateUserParams{
		Id:           id,
		PasswordHash: user.PasswordHash,
	}

	return r.queries.UpdateUser(ctx, args)
}

func (r postgresRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.queries.DeleteUser(ctx, id)
}
