package repository

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
)

type List interface {
	GetList(ctx context.Context, listId string) (*entity.List, error)
	CreateList(ctx context.Context, dto CreateListDto) (*entity.List, error)
	UpdateList(ctx context.Context, dto UpdateListDto) error
	DeleteList(ctx context.Context, listId string) error

	GetUserList(ctx context.Context, userId, listName string) (*entity.List, error)
	GetUserLists(ctx context.Context, userId string) ([]*entity.List, error)

	WithTx(tx *sql.Tx) List
}

type CreateListDto struct {
	Name       string
	SettingsId string
	UserId     string
}

type UpdateListDto struct {
	Id             string
	Name           string
	SynchronizedAt sql.NullTime
}
