package domain

import (
	"context"
	"database/sql"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"

	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal_old/domain/repository"
)

type TranslationService struct {
	translationRepository repository.Translation
	logger                *aslog.Logger
}

func NewTranslationService(
	translationRepository repository.Translation,
	logger *aslog.Logger,
) *TranslationService {
	return &TranslationService{
		translationRepository: translationRepository,
		logger:                logger,
	}
}

func (s TranslationService) CreateMediaTranslationTx(
	ctx context.Context,
	title generated.MediaTitle,
	tx *sql.Tx,
) (*entity.Translation, error) {
	dto := repository.CreateTranslationDto{
		Map: mediaTitleTranslationWrapper(title).ToMap(),
	}

	return s.translationRepository.WithTx(tx).Create(ctx, dto)
}

func (s TranslationService) UpdateMediaTranslationTx(
	ctx context.Context,
	id string,
	title generated.MediaTitle,
	tx *sql.Tx,
) (*entity.Translation, error) {
	dto := repository.UpdateTranslationDto{
		Map: mediaTitleTranslationWrapper(title).ToMap(),
	}

	return s.translationRepository.WithTx(tx).Update(ctx, id, dto)
}

type mediaTitleTranslationWrapper generated.MediaTitle

func (p mediaTitleTranslationWrapper) ToMap() map[string]string {
	var translations = map[string]string{}

	if p.Romaji != "" {
		translations["romaji"] = p.Romaji
	}
	if p.English != "" {
		translations["english"] = p.English
	}
	if p.Native != "" {
		translations["native"] = p.Native
	}

	return translations
}
