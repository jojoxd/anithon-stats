package v1

import (
	"github.com/google/uuid"
)

type UserList struct {
	Id          uuid.UUID `json:"id"`
	UserId      uuid.UUID `json:"userId"`
	DisplayName string    `json:"displayName"`
	Description string    `json:"description"`
}

type UserListEntry struct {
	Id      uuid.UUID `json:"id"`
	ListId  uuid.UUID `json:"listId"`
	MediaId uuid.UUID `json:"mediaId"`
}

type CreateUserList struct {
	DisplayName string `json:"displayName"`
	Description string `json:"description"`
}
type UpdateUserList struct {
	DisplayName string `json:"displayName"`
	Description string `json:"description"`
}

type CreateUserListEntry struct {
	MediaId uuid.UUID `json:"mediaId"`
}
type UpdateUserListEntry struct {
	// @TODO: Maybe just recreate when media id changes?
	MediaId uuid.UUID `json:"mediaId"`
}
