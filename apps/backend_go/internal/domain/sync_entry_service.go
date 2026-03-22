package domain

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strconv"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type SyncEntryService struct {
	entryRepository     repository.Entry
	entryDataRepository repository.EntryData
	seriesRepository    repository.Series
	logger              *aslog.Logger
}

func NewSyncEntryService(
	entryRepository repository.Entry,
	entryDataRepository repository.EntryData,
	seriesRepository repository.Series,
	logger *aslog.Logger,
) *SyncEntryService {
	return &SyncEntryService{
		entryRepository:     entryRepository,
		entryDataRepository: entryDataRepository,
		seriesRepository:    seriesRepository,
		logger:              logger,
	}
}

func (s SyncEntryService) SyncTx(
	ctx context.Context,
	list *entity.List,
	series *entity.Series,
	mediaListEntry generated.MediaListEntry,
	tx *sql.Tx,
) (*entity.Entry, error) {
	entry, err := s.getOrCreateEntryTx(ctx, list, series, mediaListEntry, tx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch entry: %w", err)
	}

	// todo: update

	return entry, nil
}

func (s SyncEntryService) getOrCreateEntryTx(
	ctx context.Context,
	list *entity.List,
	series *entity.Series,
	mediaListEntry generated.MediaListEntry,
	tx *sql.Tx,
) (*entity.Entry, error) {
	entry, err := s.entryRepository.WithTx(tx).GetByListAndSeriesId(ctx, list.Id, series.Id)
	if err == nil {
		return entry, nil
	}

	if !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	// create data
	createEntryDataDto := repository.CreateEntryDataDto{
		Mult:             1.0,
		Order:            sql.NullInt32{Valid: false},
		StartAt:          sql.NullInt32{Valid: false},
		Split:            sql.NullInt32{Valid: false},
		SplitSequelEntry: false,
	}

	entryData, err := s.entryDataRepository.WithTx(tx).Create(ctx, createEntryDataDto)
	if err != nil {
		return nil, err
	}

	// create
	createEntryDto := repository.CreateEntryDto{
		ListId:    list.Id,
		SeriesId:  series.Id,
		DataId:    entryData.Id,
		AnilistId: strconv.Itoa(mediaListEntry.Id),
		State:     api.EntryStatus(mediaListEntry.Status),
		Progress:  int32(mediaListEntry.Progress),
	}

	return s.entryRepository.WithTx(tx).Create(ctx, createEntryDto)
}
