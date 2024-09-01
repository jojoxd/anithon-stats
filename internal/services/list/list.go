package list

import (
	"context"
	"fmt"

	"github.com/google/uuid"
)

type Repository interface {
	Get(ctx context.Context, id uuid.UUID) (List, error)
	GetUser(ctx context.Context, userId uuid.UUID) ([]List, error)
	Search(ctx context.Context, query string) ([]List, error)
	SearchUser(ctx context.Context, userId uuid.UUID, query string) ([]List, error)
	Create(ctx context.Context, req CreateList) (uuid.UUID, error)
	Update(ctx context.Context, id uuid.UUID, req UpdateList) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type Service interface {
	Get(ctx context.Context, id uuid.UUID) (List, error)
	GetUser(ctx context.Context, userId uuid.UUID) ([]List, error)
	Search(ctx context.Context, query string) ([]List, error)
	SearchUser(ctx context.Context, userId uuid.UUID, query string) ([]List, error)
	Create(ctx context.Context, req CreateList) (List, error)
	Update(ctx context.Context, id uuid.UUID, req UpdateList) (List, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type list struct {
	repository Repository
}

func New(repository Repository) Service {
	return &list{repository}
}

func (svc *list) Get(ctx context.Context, id uuid.UUID) (List, error) {
	return svc.repository.Get(ctx, id)
}

func (svc *list) GetUser(ctx context.Context, userId uuid.UUID) ([]List, error) {
	return svc.repository.GetUser(ctx, userId)
}

func (svc *list) GetUserLists(ctx context.Context, userId uuid.UUID) ([]List, error) {
	return svc.repository.GetUser(ctx, userId)
}

func (svc *list) Search(ctx context.Context, query string) ([]List, error) {
	return svc.repository.Search(ctx, query)
}

func (svc *list) SearchUser(ctx context.Context, userId uuid.UUID, query string) ([]List, error) {
	return svc.repository.SearchUser(ctx, userId, query)
}

func (svc *list) Create(ctx context.Context, req CreateList) (List, error) {

	fmt.Println("Create List")

	id, err := svc.repository.Create(ctx, req)
	if err != nil {
		return List{}, err
	}

	fmt.Println("Get List", id)

	return svc.repository.Get(ctx, id)
}

func (svc *list) Update(ctx context.Context, id uuid.UUID, req UpdateList) (List, error) {
	if err := svc.repository.Update(ctx, id, req); err != nil {
		return List{}, err
	}

	return svc.repository.Get(ctx, id)
}

func (svc *list) Delete(ctx context.Context, id uuid.UUID) error {
	return svc.repository.Delete(ctx, id)
}
