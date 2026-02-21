package server_api

import (
	"context"
	"image"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/server/dbal"
	"anistats/pkg/anistats_client"
)

var _ anistats_client.UserListService = (*UserListService)(nil)

type UserListService struct {
	repository dbal.UserListRepository
}

func NewUserListService(repository dbal.UserListRepository) *UserListService {
	return &UserListService{
		repository: repository,
	}
}

func (svc UserListService) Create(ctx context.Context, list v1.CreateUserList) (v1.UserList, error) {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) GetList(ctx context.Context, listId uuid.UUID) (v1.UserList, error) {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) GetLists(ctx context.Context) ([]v1.UserList, error) {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) UpdateList(ctx context.Context, listId uuid.UUID, update v1.UpdateUserList) (v1.UserList, error) {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) RemoveList(ctx context.Context, listId uuid.UUID) error {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) AddEntry(ctx context.Context, listId uuid.UUID, entry v1.CreateUserListEntry) error {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) UpdateEntry(ctx context.Context, listId, entryId uuid.UUID, entry v1.UpdateUserListEntry) error {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) RemoveEntry(ctx context.Context, listId, entryId uuid.UUID) error {
	// TODO implement me
	panic("implement me")
}

func (svc UserListService) GetImage(ctx context.Context, listId uuid.UUID) (image.Image, error) {
	// TODO implement me
	panic("implement me")
}
