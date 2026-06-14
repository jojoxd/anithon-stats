package repository

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
)

type User interface {
	GetUser(ctx context.Context, userId string) (*entity.User, error)
	GetUserByAnilistId(ctx context.Context, anilistId string) (*entity.User, error)
	FindUserByName(ctx context.Context, name string) (*entity.User, error)
	CreateUser(ctx context.Context, dto CreateUserDto) (*entity.User, error)
	UpdateUser(ctx context.Context, userId string, dto UpdateUserDto) error
	DeleteUser(ctx context.Context, userId string) error

	WithTx(tx *sql.Tx) User
}

type CreateUserDto struct {
	Name      string
	AnilistId string
	AvatarUrl sql.NullString
}

type UpdateUserDto struct {
	Name      string
	AnilistId string
	AvatarUrl sql.NullString
}
