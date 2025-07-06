package sqlite

import (
	"context"

	"github.com/google/uuid"

	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/sqlite/internal/generated"

	v1 "anistats/api/v1"
)

type UserRepository struct {
	queries *generated.Queries
}

func NewUserRepository(queries *generated.Queries) *UserRepository {
	return &UserRepository{
		queries: queries,
	}
}

func (repo UserRepository) CreateUser(ctx context.Context, req dbal.CreateUserRequest) (v1.User, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return v1.User{}, err
	}

	params := generated.CreateUserParams{
		Id:   id,
		Name: req.Name,
	}

	if err = repo.queries.CreateUser(ctx, params); err != nil {
		return v1.User{}, err
	}

	return repo.GetUser(ctx, v1.UserId(id))
}

func (repo UserRepository) GetUser(ctx context.Context, id v1.UserId) (v1.User, error) {
	user, err := repo.queries.GetUser(ctx, uuid.UUID(id))
	if err != nil {
		return v1.User{}, err
	}

	mappedUser := v1.User{
		Id:   v1.UserId(user.Id),
		Name: user.Name,
	}

	return mappedUser, nil
}

func (repo UserRepository) ListUsers(ctx context.Context) ([]v1.User, error) {
	users, err := repo.queries.ListUsers(ctx)
	if err != nil {
		return nil, err
	}

	mappedUsers := make([]v1.User, len(users))
	for i, user := range users {
		mappedUser := v1.User{
			Id:   v1.UserId(user.Id),
			Name: user.Name,
		}

		mappedUsers[i] = mappedUser
	}

	return mappedUsers, nil
}

func (repo UserRepository) ListUsersP(ctx context.Context, offset int64, limit int64) ([]v1.User, error) {
	params := generated.ListUsersPParams{
		Offset: offset,
		Limit:  limit,
	}

	users, err := repo.queries.ListUsersP(ctx, params)
	if err != nil {
		return nil, err
	}

	mappedUsers := make([]v1.User, len(users))
	for i, user := range users {
		mappedUser := v1.User{
			Id:   v1.UserId(user.Id),
			Name: user.Name,
		}

		mappedUsers[i] = mappedUser
	}

	return mappedUsers, nil
}

func (repo UserRepository) DeleteUser(ctx context.Context, id v1.UserId) error {
	return repo.queries.DeleteUser(ctx, uuid.UUID(id))
}
