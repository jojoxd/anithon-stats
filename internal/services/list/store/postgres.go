package store

import (
	"context"

	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/dbal/postgres"
	list2 "gitlab.jojoxd.nl/jojoxd/anistats/internal/services/list"
)

type postgresRepo struct {
	queries *postgres.Queries
}

func NewPostgres(db postgres.DBTX) list2.Repository {
	return &postgresRepo{postgres.New(db)}
}

func (r postgresRepo) Get(ctx context.Context, id uuid.UUID) (list2.List, error) {
	model, err := r.queries.GetList(ctx, id)
	if err != nil {
		return list2.List{}, err
	}

	out := list2.List{
		Id:        model.Id,
		UserId:    model.UserID,
		Name:      model.Name,
		CreatedAt: model.CreatedAt,
		UpdatedAt: model.UpdatedAt,
	}

	return out, nil
}

// TODO Rename to ListUser
func (r postgresRepo) GetUser(ctx context.Context, userId uuid.UUID) ([]list2.List, error) {
	lists, err := r.queries.GetUserLists(ctx, userId)
	if err != nil {
		return nil, err
	}

	out := make([]list2.List, len(lists))
	for i, model := range lists {
		out[i] = list2.List{
			Id:        model.Id,
			UserId:    model.UserID,
			Name:      model.Name,
			CreatedAt: model.CreatedAt,
			UpdatedAt: model.UpdatedAt,
		}
	}

	return out, nil
}

func (r postgresRepo) Search(ctx context.Context, query string) ([]list2.List, error) {
	lists, err := r.queries.SearchLists(ctx, query)
	if err != nil {
		return nil, err
	}

	out := make([]list2.List, len(lists))
	for i, model := range lists {
		out[i] = list2.List{
			Id:        model.Id,
			UserId:    model.UserID,
			Name:      model.Name,
			CreatedAt: model.CreatedAt,
			UpdatedAt: model.UpdatedAt,
			Settings:  list2.Settings{},
		}
	}

	return out, nil
}

func (r postgresRepo) SearchUser(ctx context.Context, userId uuid.UUID, query string) ([]list2.List, error) {
	args := postgres.SearchUserListsParams{
		Name:   query,
		UserID: userId,
	}

	lists, err := r.queries.SearchUserLists(ctx, args)
	if err != nil {
		return nil, err
	}

	out := make([]list2.List, len(lists))
	for i, model := range lists {
		out[i] = list2.List{
			Id:        model.Id,
			UserId:    model.UserID,
			Name:      model.Name,
			CreatedAt: model.CreatedAt,
			UpdatedAt: model.UpdatedAt,
			Settings:  list2.Settings{},
		}
	}

	return out, nil
}

func (r postgresRepo) Create(ctx context.Context, req list2.CreateList) (uuid.UUID, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.Nil, err
	}

	args := postgres.CreateListParams{
		Id:     id,
		Name:   req.Name,
		UserID: req.UserId,
	}

	if _, err = r.queries.CreateList(ctx, args); err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r postgresRepo) Update(ctx context.Context, id uuid.UUID, req list2.UpdateList) error {
	args := postgres.UpdateListParams{
		Id:   id,
		Name: req.Name,
	}

	if err := r.queries.UpdateList(ctx, args); err != nil {
		return list2.ErrUpdate
	}

	return nil
}

func (r postgresRepo) Delete(ctx context.Context, id uuid.UUID) error {
	err := r.queries.DeleteList(ctx, id)
	if err != nil {
		return list2.ErrDelete
	}

	return nil
}
