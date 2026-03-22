package application

import (
	"context"
	"fmt"
	"image"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/entity"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain/repository"
)

type ListService struct {
	listImageService      *domain.ListImageService
	listEntryService      *domain.ListEntryService
	listChunkService      *domain.ListChunkService
	listSettingsService   *domain.ListSettingsService
	listMetadataService   *domain.ListMetadataService
	listEntryDataService  *domain.ListEntryDataService
	entryRepository       repository.Entry
	listRepository        repository.List
	seriesService         *SeriesService
	userService           *UserService
	syncService           *SyncService
	seriesRepository      repository.Series
	syncEntriesService    *domain.SyncEntryService
	translationRepository repository.Translation
}

func NewListService(
	listImageService *domain.ListImageService,
	listEntryService *domain.ListEntryService,
	listChunkService *domain.ListChunkService,
	listSettingsService *domain.ListSettingsService,
	listMetadataService *domain.ListMetadataService,
	listEntryDataService *domain.ListEntryDataService,
	listRepository repository.List,
	seriesService *SeriesService,
	entryRepository repository.Entry,
	userService *UserService,
	syncService *SyncService,
	seriesRepository repository.Series,
	syncEntriesService *domain.SyncEntryService,
	translationRepository repository.Translation,
) *ListService {
	return &ListService{
		listImageService:      listImageService,
		listEntryService:      listEntryService,
		listChunkService:      listChunkService,
		listSettingsService:   listSettingsService,
		listMetadataService:   listMetadataService,
		listEntryDataService:  listEntryDataService,
		listRepository:        listRepository,
		seriesService:         seriesService,
		entryRepository:       entryRepository,
		userService:           userService,
		syncService:           syncService,
		seriesRepository:      seriesRepository,
		syncEntriesService:    syncEntriesService,
		translationRepository: translationRepository,
	}
}

func (s ListService) GetList(ctx context.Context, listId string) (*api.List, error) {
	list, err := s.listRepository.GetList(ctx, listId)
	if err != nil {
		return nil, err
	}

	listEntries, err := s.entryRepository.GetByListId(ctx, listId)
	if err != nil {
		return nil, err
	}

	user, err := s.userService.GetUser(ctx, list.UserId)
	if err != nil {
		return nil, err
	}

	entries := api.EntryList{
		Items: make([]api.Entry, len(listEntries)),
		Data:  make([]api.EntryData, len(listEntries)),
	}

	series := api.SeriesList{
		Items: make([]api.Series, len(listEntries)),
	}

	for i, listEntry := range listEntries {
		entries.Items[i] = api.Entry{
			Id:                 listEntry.Id,
			SeriesRef:          api.SeriesRef{Id: listEntry.SeriesId},
			Episodes:           0,
			HasJoinedLastChunk: false,
			Stats: api.EntryStats{
				Chunks: 1,
				Time:   123456,
			},
			Progress:        listEntry.Progress,
			Status:          listEntry.State,
			SequelRef:       nil,
			CustomSequelRef: nil,
		}

		entries.Data[i] = api.EntryData{
			Ref:              listEntry.Id,
			Mult:             1.0,
			Order:            nil,
			Split:            nil,
			SplitSequelEntry: false,
			StartAt:          0,
		}

		serie, err := s.seriesRepository.Get(ctx, listEntry.SeriesId)
		if err != nil {
			return nil, err
		}

		title, err := s.translationRepository.Get(ctx, serie.TitleTranslationId)
		if err != nil {
			return nil, err
		}

		series.Items[i] = api.Series{
			Id: serie.Id,
			Title: api.SeriesTitle{
				Romaji:  title.Map["romaji"],
				English: title.Map["english"],
				Native:  title.Map["native"],
			},
			CoverImage:  serie.CoverImageUrl,
			Duration:    int64(serie.Duration.Minutes()),
			Episodes:    &serie.Episodes,
			Description: &serie.Description,
			PrequelIds:  nil,
			SequelIds:   nil,
		}
	}

	dto := &api.List{
		Id:   list.Id,
		User: *user,
		Settings: api.ListSettings{
			StackSize:          0,
			AllowChunkMerge:    false,
			MaxChunkLength:     0,
			MaxChunkJoinLength: 0,
		},
		Metadata: s.GetMetadata(list),
		Entries:  entries,
		Chunks: api.ChunkList{
			Items: []api.Chunk{},
		},
		Series: series,
	}

	return dto, nil
}

func (s ListService) GetMetadata(list *entity.List) api.ListMetadata {
	return api.ListMetadata{
		Title:       list.Name,
		Ref:         api.ListRef{Id: list.Id},
		Description: list.Name, // todo
		Stats: api.ListMetadataStats{
			Time: 60,
		},
	}
}

func (s ListService) UpdateList(ctx context.Context, req api.UpdateListRequest) error {
	return fmt.Errorf("Not yet implemented")
}

type GenerateListImageParams struct {
	Embed     bool
	WithStats bool
}

func (s ListService) GenerateListImage(ctx context.Context, listId string, params GenerateListImageParams) (*image.Image, error) {
	return nil, fmt.Errorf("Not yet implemented")
}
