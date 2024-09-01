package user

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	Get(ctx context.Context, id uuid.UUID) (User, error)
	List(ctx context.Context) ([]User, error)
	Search(ctx context.Context, query string) ([]User, error)
	Create(ctx context.Context, user CreateUser) (uuid.UUID, error)
	Update(ctx context.Context, id uuid.UUID, user UpdateUser) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type Service interface {
	Get(ctx context.Context, id uuid.UUID) (User, error)
	List(ctx context.Context) ([]User, error)
	Search(ctx context.Context, query string) ([]User, error)
	Create(ctx context.Context, user CreateUser) (User, error)
	Update(ctx context.Context, id uuid.UUID, user UpdateUser) (User, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type user struct {
	repository Repository
}

func New(repository Repository) Service {
	return &user{repository}
}

func (svc *user) Get(ctx context.Context, id uuid.UUID) (User, error) {
	return svc.repository.Get(ctx, id)
}

func (svc *user) List(ctx context.Context) ([]User, error) {
	return svc.repository.List(ctx)
}

func (svc *user) Search(ctx context.Context, query string) ([]User, error) {
	return svc.repository.Search(ctx, query)
}

func (svc *user) Create(ctx context.Context, user CreateUser) (User, error) {
	id, err := svc.repository.Create(ctx, user)
	if err != nil {
		return User{}, err
	}

	return svc.repository.Get(ctx, id)
}

func (svc *user) Update(ctx context.Context, id uuid.UUID, update UpdateUser) (User, error) {
	err := svc.repository.Update(ctx, id, update)
	if err != nil {
		return User{}, err
	}

	return svc.repository.Get(ctx, id)
}

func (svc *user) Delete(ctx context.Context, id uuid.UUID) error {
	return svc.repository.Delete(ctx, id)
}
