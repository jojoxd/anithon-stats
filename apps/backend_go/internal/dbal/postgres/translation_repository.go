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

type translationRepository struct {
	logger  *aslog.Logger
	queries *generated.Queries
}

func (r translationRepository) Get(ctx context.Context, id string) (*entity.Translation, error) {
	pgtranslations, err := r.queries.GetTranslation(ctx, uuid.MustParse(id))
	if err != nil {
		return nil, err
	}

	return r.convert(id, pgtranslations), nil
}

func (r translationRepository) Create(ctx context.Context, dto repository.CreateTranslationDto) (*entity.Translation, error) {
	pgtranslationId, err := r.queries.CreateTranslation(ctx)
	if err != nil {
		return nil, err
	}

	for locale, translation := range dto.Map {
		params := generated.SetTranslationParams{
			ID:          pgtranslationId,
			Locale:      locale,
			Translation: translation,
		}

		_, err := r.queries.SetTranslation(ctx, params)
		if err != nil {
			return nil, err
		}
	}

	return r.Get(ctx, pgtranslationId.String())
}

func (r translationRepository) Update(ctx context.Context, id string, dto repository.UpdateTranslationDto) (*entity.Translation, error) {
	for locale, translation := range dto.Map {
		params := generated.SetTranslationParams{
			ID:          uuid.MustParse(id),
			Locale:      locale,
			Translation: translation,
		}

		_, err := r.queries.SetTranslation(ctx, params)
		if err != nil {
			return nil, err
		}
	}

	return r.Get(ctx, id)
}

func (r translationRepository) Delete(ctx context.Context, id string) error {
	return r.queries.DeleteTranslation(ctx, uuid.MustParse(id))
}

func (r translationRepository) DeleteTranslation(ctx context.Context, id, locale string) error {
	params := generated.DeleteTranslationLocaleParams{
		ID:     uuid.MustParse(id),
		Locale: locale,
	}

	return r.queries.DeleteTranslationLocale(ctx, params)
}

func (r translationRepository) convert(id string, pgtranslations []generated.TranslationsTranslation) *entity.Translation {
	ent := &entity.Translation{
		Id:  id,
		Map: map[string]string{},
	}

	for _, pgtranslation := range pgtranslations {
		ent.Map[pgtranslation.Locale] = pgtranslation.Translation
	}

	return ent
}

func (r translationRepository) WithTx(tx *sql.Tx) repository.Translation {
	return &translationRepository{
		logger:  r.logger,
		queries: r.queries.WithTx(tx),
	}
}
