package repository

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
)

type Translation interface {
	Get(ctx context.Context, id string) (*entity.Translation, error)
	Create(ctx context.Context, dto CreateTranslationDto) (*entity.Translation, error)
	Update(ctx context.Context, id string, dto UpdateTranslationDto) (*entity.Translation, error)
	Delete(ctx context.Context, id string) error
	DeleteTranslation(ctx context.Context, id, locale string) error

	WithTx(tx *sql.Tx) Translation
}

type CreateTranslationDto struct {
	Map map[string]string
}

type UpdateTranslationDto struct {
	Map map[string]string
}
