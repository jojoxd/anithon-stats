package sqlite

import (
	"context"

	"github.com/google/uuid"
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/sqlite/internal/generated"
)

type TranslationRepository struct {
	queries *generated.Queries
}

func NewTranslationRepository(queries *generated.Queries) *TranslationRepository {
	return &TranslationRepository{
		queries: queries,
	}
}

func (repo TranslationRepository) CreateTranslation(ctx context.Context, request dbal.CreateTranslationRequest) (*v1.Translatable, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return nil, err
	}

	for locale, translation := range request.Translations {
		params := generated.CreateTranslationParams{
			Id:          id,
			Locale:      locale.String(),
			Translation: translation,
		}

		if err = repo.queries.CreateTranslation(ctx, params); err != nil {
			return nil, err
		}
	}

	return repo.GetTranslation(ctx, id)
}

func (repo TranslationRepository) GetTranslation(ctx context.Context, id uuid.UUID) (*v1.Translatable, error) {
	translations, err := repo.queries.GetTranslations(ctx, id)
	if err != nil {
		return nil, err
	}

	translationMap := map[language.Tag]string{}
	for _, translation := range translations {
		tag, err := language.Parse(translation.Locale)
		if err != nil {
			return nil, err
		}

		translationMap[tag] = translation.Translation
	}

	translatable := &v1.Translatable{
		Id:           id,
		Translations: translationMap,
	}

	return translatable, nil
}
