package media

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	Get(ctx context.Context, id uuid.UUID) (Media, error)
	Create(ctx context.Context, req CreateMedia) (uuid.UUID, error)
	Update(ctx context.Context, id uuid.UUID, req UpdateMedia) error
	SearchByName(ctx context.Context, name string) ([]Media, error)
	Delete(ctx context.Context, id uuid.UUID) error

	SetTranslation(ctx context.Context, id uuid.UUID, req SetTranslation) error
	GetTranslations(ctx context.Context, id uuid.UUID) ([]Translation, error)
	DeleteTranslation(ctx context.Context, mediaId uuid.UUID, languageCode string) error
}

type Service interface {
	Get(ctx context.Context, id uuid.UUID) (Media, error)
	Create(ctx context.Context, req CreateMedia) (Media, error)
	Update(ctx context.Context, id uuid.UUID, req UpdateMedia) (Media, error)
	SearchByName(ctx context.Context, name string) ([]Media, error)
	Delete(ctx context.Context, id uuid.UUID) error

	GetTranslations(ctx context.Context, mediaId uuid.UUID) ([]Translation, error)
	SetTranslation(ctx context.Context, mediaId uuid.UUID, req SetTranslation) error
	DeleteTranslation(ctx context.Context, mediaId uuid.UUID, languageCode string) error
}

type media struct {
	repository Repository
}

func New(repository Repository) Service {
	return &media{repository}
}

func (svc media) Get(ctx context.Context, id uuid.UUID) (Media, error) {
	return svc.repository.Get(ctx, id)
}

func (svc media) Create(ctx context.Context, req CreateMedia) (Media, error) {
	id, err := svc.repository.Create(ctx, req)
	if err != nil {
		return Media{}, err
	}

	return svc.repository.Get(ctx, id)
}

func (svc media) Update(ctx context.Context, id uuid.UUID, req UpdateMedia) (Media, error) {
	err := svc.repository.Update(ctx, id, req)
	if err != nil {
		return Media{}, err
	}

	return svc.repository.Get(ctx, id)
}

func (svc media) SearchByName(ctx context.Context, name string) ([]Media, error) {
	return svc.repository.SearchByName(ctx, name)
}

func (svc media) Delete(ctx context.Context, id uuid.UUID) error {
	return svc.repository.Delete(ctx, id)
}

func (svc media) GetTranslations(ctx context.Context, mediaId uuid.UUID) ([]Translation, error) {
	return svc.repository.GetTranslations(ctx, mediaId)
}

func (svc media) SetTranslation(ctx context.Context, mediaId uuid.UUID, req SetTranslation) error {
	return svc.repository.SetTranslation(ctx, mediaId, req)
}

func (svc media) DeleteTranslation(ctx context.Context, mediaId uuid.UUID, languageCode string) error {
	return svc.repository.DeleteTranslation(ctx, mediaId, languageCode)
}
