package activity

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

type Repository interface {
	Get(ctx context.Context, id uuid.UUID) (Activity, error)
	CreateList(ctx context.Context, req CreateList) (uuid.UUID, error)
	CreateListEntry(ctx context.Context, req CreateListEntry) (uuid.UUID, error)
	CreateUser(ctx context.Context, req CreateUser) (uuid.UUID, error)
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteForUser(ctx context.Context, id uuid.UUID) error

	GetMessage(ctx context.Context, id uuid.UUID) (Message, error)
	CreateMessage(ctx context.Context, req CreateMessage) (uuid.UUID, error)
	UpdateMessage(ctx context.Context, id uuid.UUID, req UpdateMessage) error
	DeleteMessage(ctx context.Context, id uuid.UUID) error
	DeleteMessagesForUser(ctx context.Context, userId uuid.UUID) error
}

type Service interface {
	Get(ctx context.Context, id uuid.UUID) (Activity, error)
	CreateList(ctx context.Context, req CreateList) (*List, error)
	CreateListEntry(ctx context.Context, req CreateListEntry) (*ListEntry, error)
	CreateUser(ctx context.Context, req CreateUser) (*User, error)
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteForUser(ctx context.Context, userId uuid.UUID) error

	GetMessage(ctx context.Context, id uuid.UUID) (*Message, error)
	CreateMessage(ctx context.Context, req CreateMessage) (*Message, error)
	UpdateMessage(ctx context.Context, id uuid.UUID, req UpdateMessage) (*Message, error)
	DeleteMessage(ctx context.Context, id uuid.UUID) error
	DeleteMessagesForUser(ctx context.Context, userId uuid.UUID) error
}

type activity struct {
	repository Repository
}

func New(repository Repository) Service {
	return &activity{repository}
}

func (svc activity) Get(ctx context.Context, id uuid.UUID) (Activity, error) {
	return svc.repository.Get(ctx, id)
}

func (svc activity) CreateList(ctx context.Context, req CreateList) (*List, error) {
	id, err := svc.repository.CreateList(ctx, req)
	if err != nil {
		return nil, err
	}

	model, err := svc.repository.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	if t, ok := model.(List); ok {
		return &t, nil
	}

	return nil, errors.New("invalid type")
}

func (svc activity) CreateListEntry(ctx context.Context, req CreateListEntry) (*ListEntry, error) {
	id, err := svc.repository.CreateListEntry(ctx, req)
	if err != nil {
		return nil, err
	}

	model, err := svc.repository.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	if t, ok := model.(ListEntry); ok {
		return &t, nil
	}

	return nil, errors.New("invalid type")
}

func (svc activity) CreateUser(ctx context.Context, req CreateUser) (*User, error) {
	id, err := svc.repository.CreateUser(ctx, req)
	if err != nil {
		return nil, err
	}

	model, err := svc.repository.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	if t, ok := model.(User); ok {
		return &t, nil
	}

	return nil, errors.New("invalid type")
}

func (svc activity) Delete(ctx context.Context, id uuid.UUID) error {
	return svc.repository.Delete(ctx, id)
}

func (svc activity) DeleteForUser(ctx context.Context, userId uuid.UUID) error {
	return svc.repository.DeleteForUser(ctx, userId)
}

func (svc activity) GetMessage(ctx context.Context, id uuid.UUID) (*Message, error) {
	message, err := svc.repository.GetMessage(ctx, id)
	if err != nil {
		return nil, err
	}

	return &message, err
}

func (svc activity) CreateMessage(ctx context.Context, req CreateMessage) (*Message, error) {
	id, err := svc.repository.CreateMessage(ctx, req)
	if err != nil {
		return nil, err
	}

	return svc.GetMessage(ctx, id)
}

func (svc activity) UpdateMessage(ctx context.Context, id uuid.UUID, req UpdateMessage) (*Message, error) {
	err := svc.repository.UpdateMessage(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return svc.GetMessage(ctx, id)
}

func (svc activity) DeleteMessage(ctx context.Context, id uuid.UUID) error {
	return svc.repository.DeleteMessage(ctx, id)
}

func (svc activity) DeleteMessagesForUser(ctx context.Context, userId uuid.UUID) error {
	return svc.repository.DeleteMessagesForUser(ctx, userId)
}
