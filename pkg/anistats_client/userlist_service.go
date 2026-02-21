package anistats_client

import (
	"context"
	"image"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
)

type UserListService interface {
	// Create creates and persists a v1.UserList
	Create(ctx context.Context, list v1.CreateUserList) (v1.UserList, error)
	// GetList gets a v1.UserList
	GetList(ctx context.Context, listId uuid.UUID) (v1.UserList, error)
	// GetLists gets a list of v1.UserList
	GetLists(ctx context.Context) ([]v1.UserList, error)
	// UpdateList updates a v1.UserList
	UpdateList(ctx context.Context, listId uuid.UUID, update v1.UpdateUserList) (v1.UserList, error)
	// RemoveList deletes a v1.UserList
	RemoveList(ctx context.Context, listId uuid.UUID) error
	// AddEntry adds an entry to a list by listId
	AddEntry(ctx context.Context, listId uuid.UUID, entry v1.CreateUserListEntry) error
	// UpdateEntry updates a specific entry of a list
	UpdateEntry(ctx context.Context, listId, entryId uuid.UUID, entry v1.UpdateUserListEntry) error
	// RemoveEntry removes a specific entry from a list
	RemoveEntry(ctx context.Context, listId, entryId uuid.UUID) error
	// GetImage generates an image of a v1.UserList
	GetImage(ctx context.Context, listId uuid.UUID) (image.Image, error)
}
