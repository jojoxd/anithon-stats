package postgres

import (
	"context"
	"database/sql"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/internal/dbal/postgres/internal/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type listRepository struct {
	logger  *aslog.Logger
	queries *generated.Queries
}

func (r listRepository) GetList(ctx context.Context, listId string) (*entity.List, error) {
	pglist, err := r.queries.GetList(ctx, uuid.MustParse(listId))
	if err != nil {
		return nil, err
	}

	return r.convertList(pglist), nil
}

func (r listRepository) CreateList(ctx context.Context, dto repository.CreateListDto) (*entity.List, error) {
	// todo: uuid's should be app-global, until api-layer
	params := generated.CreateListParams{
		SettingsID: uuid.NullUUID{
			UUID:  uuid.MustParse(dto.SettingsId),
			Valid: true,
		},
		Name:   dto.Name,
		UserID: uuid.MustParse(dto.UserId),
	}

	pglist, err := r.queries.CreateList(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convertList(pglist), nil
}

func (r listRepository) UpdateList(ctx context.Context, dto repository.UpdateListDto) error {
	params := generated.UpdateListParams{
		ID:             uuid.MustParse(dto.Id),
		Name:           dto.Name,
		SynchronizedAt: dto.SynchronizedAt,
	}

	err := r.queries.UpdateList(ctx, params)

	return err
}

func (r listRepository) DeleteList(ctx context.Context, listId string) error {
	return r.queries.DeleteList(ctx, uuid.MustParse(listId))
}

func (r listRepository) SearchLists(ctx context.Context, query string) ([]*entity.List, error) {
	pglists, err := r.queries.SearchList(ctx, query)
	if err != nil {
		return nil, err
	}

	lists := make([]*entity.List, len(pglists))
	for i, pglist := range pglists {
		lists[i] = r.convertList(pglist)
	}

	return lists, nil
}

func (r listRepository) GetUserList(ctx context.Context, userId, listName string) (*entity.List, error) {
	params := generated.GetUserListParams{
		UserID: uuid.MustParse(userId),
		Name:   listName,
	}

	pglist, err := r.queries.GetUserList(ctx, params)
	if err != nil {
		return nil, err
	}

	return r.convertList(pglist), nil
}

func (r listRepository) GetUserLists(ctx context.Context, userId string) ([]*entity.List, error) {
	pglists, err := r.queries.GetUserLists(ctx, uuid.MustParse(userId))
	if err != nil {
		return nil, err
	}

	lists := make([]*entity.List, len(pglists))
	for i, pglist := range pglists {
		lists[i] = r.convertList(pglist)
	}

	return lists, nil
}

func (r listRepository) WithTx(tx *sql.Tx) repository.List {
	return &listRepository{
		logger:  r.logger,
		queries: r.queries.WithTx(tx),
	}
}

func (r listRepository) convertList(list generated.List) *entity.List {
	return &entity.List{
		Id:         list.ID.String(),
		UserId:     list.UserID.String(),
		SettingsId: list.SettingsID.UUID.String(),
		Name:       list.Name,
		Entries:    nil,
		Chunks:     nil,
	}
}
