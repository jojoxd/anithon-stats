package store

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"

	"gitlab.jojoxd.nl/jojoxd/anistats/internal/dbal/postgres"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/activity"
	"gitlab.jojoxd.nl/jojoxd/anistats/internal/services/activity/store/internal"
)

type postgresRepo struct {
	db      *sql.DB
	queries *postgres.Queries
}

func NewPostgres(db *sql.DB) activity.Repository {
	return &postgresRepo{
		db:      db,
		queries: postgres.New(db),
	}
}

func (r postgresRepo) Get(ctx context.Context, id uuid.UUID) (activity.Activity, error) {
	model, err := r.queries.GetActivity(ctx, id)
	if err != nil {
		return nil, err
	}

	baseActivity := activity.NewCommon(model.Id, model.UserID, model.CreatedAt)

	switch internal.Discriminator(model.Discriminator) {
	case internal.ListActivityDiscriminator:
		if !model.ListID.Valid {
			return nil, errors.New("list_id not found")
		}
		return activity.NewList(
			baseActivity,
			activity.ListActivityType(model.Type),
			model.ListID.UUID,
		), nil

	case internal.ListEntryActivityDiscriminator:
		if !model.ListEntryID.Valid {
			return nil, errors.New("list_entry_id not found")
		}

		return activity.NewListEntry(
			baseActivity,
			activity.ListEntryActivityType(model.Type),
			model.ListEntryID.UUID,
		), nil

	case internal.UserActivityDiscriminator:
		return activity.NewUser(
			baseActivity,
			activity.UserActivityType(model.Type),
		), nil
	}

	return nil, errors.New("unknown activity type")
}

func createCommonActivity(
	ctx context.Context,
	q *postgres.Queries,
	discriminator internal.Discriminator,
	req activity.CreateActivity,
) (uuid.UUID, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.Nil, err
	}

	args := postgres.CreateActivityParams{
		Id:            id,
		Discriminator: string(discriminator),
		UserID:        req.UserId,
	}

	err = q.CreateActivity(ctx, args)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r postgresRepo) CreateList(ctx context.Context, req activity.CreateList) (uuid.UUID, error) {
	tx, err := r.db.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		return uuid.Nil, err
	}

	defer tx.Rollback()
	qtx := r.queries.WithTx(tx)

	id, err := createCommonActivity(ctx, qtx, internal.ListActivityDiscriminator, req.Common)
	if err != nil {
		return uuid.Nil, err
	}

	args := postgres.CreateListActivityParams{
		ActivityID: id,
		ListID:     req.ListId,
		Type:       string(req.Type),
	}

	err = qtx.CreateListActivity(ctx, args)
	if err != nil {
		return uuid.Nil, err
	}

	err = tx.Commit()
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r postgresRepo) CreateListEntry(ctx context.Context, req activity.CreateListEntry) (uuid.UUID, error) {
	tx, err := r.db.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		return uuid.Nil, err
	}

	defer tx.Rollback()
	qtx := r.queries.WithTx(tx)

	id, err := createCommonActivity(ctx, qtx, internal.ListEntryActivityDiscriminator, req.Common)
	if err != nil {
		return uuid.Nil, err
	}

	args := postgres.CreateListEntryActivityParams{
		ActivityID:  id,
		Type:        string(req.Type),
		ListEntryID: req.ListEntryId,
	}

	err = qtx.CreateListEntryActivity(ctx, args)
	if err != nil {
		return uuid.Nil, err
	}

	err = tx.Commit()
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r postgresRepo) CreateUser(ctx context.Context, req activity.CreateUser) (uuid.UUID, error) {
	tx, err := r.db.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		return uuid.Nil, err
	}

	defer tx.Rollback()
	qtx := r.queries.WithTx(tx)
	id, err := createCommonActivity(ctx, qtx, internal.UserActivityDiscriminator, req.Common)

	if err != nil {
		return uuid.Nil, err
	}

	args := postgres.CreateUserActivityParams{
		ActivityID: id,
		Type:       string(req.Type),
	}

	err = qtx.CreateUserActivity(ctx, args)
	if err != nil {
		return uuid.Nil, err
	}

	err = tx.Commit()
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r postgresRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.queries.DeleteActivity(ctx, id)
}

func (r postgresRepo) DeleteForUser(ctx context.Context, userId uuid.UUID) error {
	return r.queries.DeleteActivitiesForUser(ctx, userId)
}

func (r postgresRepo) GetMessage(ctx context.Context, id uuid.UUID) (activity.Message, error) {
	model, err := r.queries.GetActivityMessage(ctx, id)
	if err != nil {
		return activity.Message{}, err
	}

	out := activity.Message{
		Id:         model.Id,
		ActivityId: model.ActivityID,
		AuthorId:   model.AuthorID,
		Message:    model.Message,
		CreatedAt:  model.CreatedAt,
		UpdatedAt:  model.UpdatedAt,
	}

	return out, nil
}

func (r postgresRepo) CreateMessage(ctx context.Context, req activity.CreateMessage) (uuid.UUID, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.Nil, err
	}

	args := postgres.CreateActivityMessageParams{
		Id:         id,
		ActivityID: req.ActivityId,
		AuthorID:   req.AuthorId,
		Message:    req.Message,
	}

	err = r.queries.CreateActivityMessage(ctx, args)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r postgresRepo) UpdateMessage(ctx context.Context, id uuid.UUID, req activity.UpdateMessage) error {
	args := postgres.UpdateActivityMessageParams{
		Id:      id,
		Message: req.Message,
	}

	err := r.queries.UpdateActivityMessage(ctx, args)
	if err != nil {
		return err
	}

	return nil
}

func (r postgresRepo) DeleteMessage(ctx context.Context, id uuid.UUID) error {
	return r.queries.DeleteActivityMessage(ctx, id)
}

func (r postgresRepo) DeleteMessagesForUser(ctx context.Context, userId uuid.UUID) error {
	return r.queries.DeleteActivityMessagesForUser(ctx, userId)
}
