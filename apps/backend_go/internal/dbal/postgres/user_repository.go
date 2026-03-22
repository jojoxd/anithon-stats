package postgres

import (
	"context"
	"database/sql"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type userRepository struct {
	logger  *aslog.Logger
	queries *generated.Queries
}

func (r userRepository) GetUser(ctx context.Context, userId string) (*entity.User, error) {
	pguser, err := r.queries.GetUser(ctx, uuid.MustParse(userId))
	if err != nil {
		return nil, err
	}

	return r.convertUser(pguser), nil
}

func (r userRepository) GetUserByAnilistId(ctx context.Context, anilistId string) (*entity.User, error) {
	pguser, err := r.queries.GetUserByAnilistId(ctx, anilistId)
	if err != nil {
		return nil, err
	}

	return r.convertUser(pguser), nil
}

func (r userRepository) FindUserByName(ctx context.Context, username string) (*entity.User, error) {
	pguser, err := r.queries.FindUserByName(ctx, username)
	if err != nil {
		return nil, err
	}

	return r.convertUser(pguser), nil
}

func (r userRepository) CreateUser(ctx context.Context, dto repository.CreateUserDto) (*entity.User, error) {
	params := generated.CreateUserParams{
		AnilistID: dto.AnilistId,
		Name:      dto.Name,
		AvatarUrl: dto.AvatarUrl,
	}

	pguser, err := r.queries.CreateUser(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convertUser(pguser), nil
}

func (r userRepository) UpdateUser(ctx context.Context, userId string, dto repository.UpdateUserDto) error {
	params := generated.UpdateUserParams{
		ID:        uuid.MustParse(userId),
		AnilistID: dto.AnilistId,
		Name:      dto.Name,
		AvatarUrl: dto.AvatarUrl,
	}

	return r.queries.UpdateUser(ctx, params)
}

func (r userRepository) DeleteUser(ctx context.Context, userId string) error {
	return r.queries.DeleteUser(ctx, uuid.MustParse(userId))
}

func (r userRepository) WithTx(tx *sql.Tx) repository.User {
	return &userRepository{
		logger:  r.logger,
		queries: r.queries.WithTx(tx),
	}
}

func (r userRepository) convertUser(user generated.User) *entity.User {
	return &entity.User{
		Id:        user.ID.String(),
		Username:  user.Name,
		AnilistId: user.AnilistID,
		AvatarUrl: user.AvatarUrl,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.SynchronizedAt,
	}
}
