package sqlite

import (
	"context"

	"github.com/google/uuid"

	v1 "anistats/api/v1"
	"anistats/internal/server/dbal/sqlite/internal/generated"
)

type UserListRepository struct {
	queries *generated.Queries
}

func NewUserListRepository(queries *generated.Queries) *UserListRepository {
	return &UserListRepository{
		queries: queries,
	}
}

func (repo UserListRepository) Create(ctx context.Context, userId uuid.UUID, req v1.CreateUserList) (v1.UserList, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return v1.UserList{}, err
	}

	params := generated.CreateUserListParams{
		Id:          id,
		UserUuid:    userId,
		Name:        req.DisplayName,
		Description: req.Description,
	}

	if err = repo.queries.CreateUserList(ctx, params); err != nil {
		return v1.UserList{}, err
	}

	return repo.Get(ctx, id)
}

func (repo UserListRepository) Get(ctx context.Context, userlistId uuid.UUID) (v1.UserList, error) {
	list, err := repo.queries.GetUserList(ctx, userlistId)
	if err != nil {
		return v1.UserList{}, err
	}

	return mapUserList(list), nil
}

func (repo UserListRepository) List(ctx context.Context) ([]v1.UserList, error) {
	lists, err := repo.queries.GetUserLists(ctx)
	if err != nil {
		return []v1.UserList{}, err
	}

	mappedLists := make([]v1.UserList, len(lists))
	for i, list := range lists {
		mappedLists[i] = mapUserList(list)
	}

	return mappedLists, nil
}

func (repo UserListRepository) ListP(ctx context.Context, offset, limit int64) ([]v1.UserList, error) {
	params := generated.GetUserListsPParams{
		Limit:  limit,
		Offset: offset,
	}

	lists, err := repo.queries.GetUserListsP(ctx, params)
	if err != nil {
		return []v1.UserList{}, err
	}

	mappedLists := make([]v1.UserList, len(lists))
	for i, list := range lists {
		mappedLists[i] = mapUserList(list)
	}

	return mappedLists, nil
}

func (repo UserListRepository) Update(ctx context.Context, userlistId uuid.UUID, req v1.UpdateUserList) (v1.UserList, error) {
	params := generated.UpdateUserListParams{
		Id:          userlistId,
		Name:        req.DisplayName,
		Description: req.Description,
	}

	if err := repo.queries.UpdateUserList(ctx, params); err != nil {
		return v1.UserList{}, err
	}

	return repo.Get(ctx, userlistId)
}

func (repo UserListRepository) Delete(ctx context.Context, userlistId uuid.UUID) error {
	return repo.queries.DeleteUserList(ctx, userlistId)
}

func (repo UserListRepository) AddEntry(ctx context.Context, userlistId uuid.UUID, req v1.CreateUserListEntry) (v1.UserListEntry, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return v1.UserListEntry{}, err
	}

	params := generated.AddUserListEntryParams{
		Id:           id,
		UserlistUuid: userlistId,
		MediaUuid:    req.MediaId,
	}

	if err := repo.queries.AddUserListEntry(ctx, params); err != nil {
		return v1.UserListEntry{}, err
	}

	return repo.GetEntry(ctx, id)
}

func (repo UserListRepository) GetEntry(ctx context.Context, entryId uuid.UUID) (v1.UserListEntry, error) {
	entry, err := repo.queries.GetUserListEntry(ctx, entryId)
	if err != nil {
		return v1.UserListEntry{}, err
	}

	return mapUserListEntry(entry), nil
}

func (repo UserListRepository) GetEntries(ctx context.Context, userlistId uuid.UUID) ([]v1.UserListEntry, error) {
	entries, err := repo.queries.GetUserListEntries(ctx, userlistId)
	if err != nil {
		return []v1.UserListEntry{}, err
	}

	mappedEntries := make([]v1.UserListEntry, len(entries))
	for i, entry := range entries {
		mappedEntries[i] = mapUserListEntry(entry)
	}

	return mappedEntries, nil
}

func (repo UserListRepository) UpdateEntry(ctx context.Context, entryId uuid.UUID, req v1.UpdateUserListEntry) (v1.UserListEntry, error) {
	params := generated.UpdateUserListEntryParams{
		Id:        entryId,
		MediaUuid: req.MediaId,
	}

	if err := repo.queries.UpdateUserListEntry(ctx, params); err != nil {
		return v1.UserListEntry{}, err
	}

	return repo.GetEntry(ctx, entryId)
}

func (repo UserListRepository) DeleteEntry(ctx context.Context, entryId uuid.UUID) error {
	return repo.queries.DeleteUserListEntry(ctx, entryId)
}

func mapUserList(list generated.UserList) v1.UserList {
	return v1.UserList{
		Id:          list.Id,
		UserId:      list.UserUuid,
		DisplayName: list.Name,
		Description: list.Description,
	}
}

func mapUserListEntry(entry generated.UserListEntry) v1.UserListEntry {
	return v1.UserListEntry{
		Id:      entry.Id,
		ListId:  entry.UserlistUuid,
		MediaId: entry.MediaUuid,
	}
}
