package sqlite

import (
	"context"
	"time"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/sqlite/internal/generated"
)

type MediaRepository struct {
	queries               *generated.Queries
	translationRepository *TranslationRepository
}

func NewMediaRepository(queries *generated.Queries) MediaRepository {
	return MediaRepository{
		queries:               queries,
		translationRepository: NewTranslationRepository(queries),
	}
}

func (repo MediaRepository) CreateMedia(ctx context.Context, request dbal.CreateMediaRequest) (v1.Media, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return v1.Media{}, err
	}

	displayName, err := repo.translationRepository.CreateTranslation(ctx, request.DisplayName)
	if err != nil {
		return v1.Media{}, err
	}

	params := generated.CreateMediaParams{
		Id:                      id,
		DisplayName:             displayName.Id,
		Description:             request.Description,
		EpisodesTotal:           request.EpisodesTotal,
		EpisodesDurationSeconds: int64(request.EpisodesDuration.Seconds()),
	}

	if err := repo.queries.CreateMedia(ctx, params); err != nil {
		return v1.Media{}, err
	}

	return repo.GetMedia(ctx, v1.MediaId(id))
}

func (repo MediaRepository) GetMedia(ctx context.Context, id v1.MediaId) (v1.Media, error) {
	media, err := repo.queries.GetMedia(ctx, uuid.UUID(id))
	if err != nil {
		return v1.Media{}, err
	}

	displayName, err := repo.translationRepository.GetTranslation(ctx, media.DisplayName)
	if err != nil {
		return v1.Media{}, err
	}

	mappedMedia := v1.Media{
		Id:          v1.MediaId(media.Id),
		DisplayName: displayName,
		Description: media.Description,
		Episodes: v1.MediaEpisodes{
			Total:    media.EpisodesTotal,
			Duration: time.Duration(media.EpisodesDurationSeconds) * time.Second,
		},
		Related: v1.MediaRelations{
			PrequelIds: make([]v1.MediaId, 0),
			SequelIds:  make([]v1.MediaId, 0),
		},
	}

	return mappedMedia, nil
}

func (repo MediaRepository) ListMedia(ctx context.Context) ([]v1.Media, error) {
	medias, err := repo.queries.ListMedia(ctx)
	if err != nil {
		return nil, err
	}

	mappedMedias := make([]v1.Media, len(medias))
	for i, media := range medias {
		displayName, err := repo.translationRepository.GetTranslation(ctx, media.DisplayName)
		if err != nil {
			return nil, err
		}

		mappedMedia := v1.Media{
			Id:          v1.MediaId(media.Id),
			DisplayName: displayName,
			Description: media.Description,
			Episodes: v1.MediaEpisodes{
				Total:    media.EpisodesTotal,
				Duration: time.Duration(media.EpisodesDurationSeconds) * time.Second,
			},
			Related: v1.MediaRelations{
				PrequelIds: make([]v1.MediaId, 0),
				SequelIds:  make([]v1.MediaId, 0),
			},
		}

		mappedMedias[i] = mappedMedia
	}

	return mappedMedias, nil
}

func (repo MediaRepository) ListMediaP(ctx context.Context, offset int64, limit int64) ([]v1.Media, error) {
	params := generated.ListMediaPParams{
		Offset: offset,
		Limit:  limit,
	}

	medias, err := repo.queries.ListMediaP(ctx, params)
	if err != nil {
		return nil, err
	}

	mappedMedias := make([]v1.Media, len(medias))
	for i, media := range medias {
		mappedMedia := v1.Media{
			Id:          v1.MediaId(media.Id),
			DisplayName: v1.Translatable{},
			Description: media.Description,
			Episodes: v1.MediaEpisodes{
				Total:    media.EpisodesTotal,
				Duration: time.Duration(media.EpisodesDurationSeconds) * time.Second,
			},
			Related: v1.MediaRelations{
				PrequelIds: make([]v1.MediaId, 0),
				SequelIds:  make([]v1.MediaId, 0),
			},
		}

		mappedMedias[i] = mappedMedia
	}

	return mappedMedias, nil
}

func (repo MediaRepository) DeleteMedia(ctx context.Context, id v1.MediaId) error {
	return repo.queries.DeleteMedia(ctx, uuid.UUID(id))
}
