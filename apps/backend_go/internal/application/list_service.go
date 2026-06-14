package application

import (
	"context"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/ent/list"
	"git.jojoxd.nl/projects/anistats/backend/internal/domain"
)

type ListService struct {
	db                 *ent.Client
	listDomainService  *domain.ListService
	entryDomainService *domain.EntryService
}

func NewListService(
	db *ent.Client,
	listDomainService *domain.ListService,
	entryDomainService *domain.EntryService,
) *ListService {
	return &ListService{
		db: db,

		listDomainService:  listDomainService,
		entryDomainService: entryDomainService,
	}
}

func (svc ListService) GetList(ctx context.Context, listId uuid.UUID) (*api.List, error) {
	list, err := svc.db.List.Query().
		Where(list.ID(listId)).
		WithOwner().
		WithEntries(func(entry *ent.ListEntryQuery) {
			entry.
				WithSeries(func(series *ent.SeriesQuery) {
					series.
						WithPrequels().
						WithSequels()
				}).
				WithCustomSequelSeries()
		}).
		Only(ctx)

	if err != nil {
		return nil, err
	}

	user := list.Edges.Owner

	response := &api.List{
		Id: list.ID.String(),

		User: api.User{
			Id:     user.ID.String(),
			Name:   user.Name,
			Avatar: *user.AvatarURL,
		},

		Settings: api.ListSettings{
			StackSize:          list.StackSize,
			AllowChunkMerge:    list.AllowChunkMerge,
			MaxChunkLength:     list.MaxChunkLength,
			MaxChunkJoinLength: list.MaxChunkJoinLength,
		},

		Metadata: svc.listDomainService.BuildMetadata(list),

		Entries: svc.entryDomainService.ToList(ctx, list),
		Chunks:  api.ChunkList{},

		Series: listSeries(list.Edges.Entries),
	}

	return response, nil
}

func listSeries(entries []*ent.ListEntry) api.SeriesList {
	list := api.SeriesList{
		Items: make([]api.Series, len(entries)),
	}

	for i, entry := range entries {
		list.Items[i] = seriesToApi(entry.Edges.Series)
	}

	return list
}

func seriesToApi(series *ent.Series) api.Series {
	prequelIds := make([]string, len(series.Edges.Prequels))
	for i, prequel := range series.Edges.Prequels {
		prequelIds[i] = prequel.ID.String()
	}

	sequelIds := make([]string, len(series.Edges.Sequels))
	for i, sequel := range series.Edges.Sequels {
		sequelIds[i] = sequel.ID.String()
	}

	return api.Series{
		Id: series.ID.String(),
		Title: api.SeriesTitle{
			Romaji:  *series.TitleRomaji,
			English: *series.TitleEnglish,
			Native:  *series.TitleNative,
		},
		CoverImage:  series.CoverImageURL,
		Duration:    int64(series.Duration.Minutes()), // todo remove cast
		Episodes:    new(int64(series.Episodes)),
		Description: new(series.Description),
		PrequelIds:  prequelIds,
		SequelIds:   sequelIds,
	}
}

func (svc ListService) GetAllByUserId(ctx context.Context, userId uuid.UUID) (*api.UserListsResponse, error) {
	user, err := svc.db.User.Get(ctx, userId)
	if err != nil {
		return nil, err
	}

	lists, err := user.QueryLists().
		WithOwner().
		WithEntries(func(entry *ent.ListEntryQuery) {
			entry.
				WithSeries().
				WithCustomSequelSeries()
		}).
		All(ctx)

	if err != nil {
		return nil, err
	}

	response := &api.UserListsResponse{
		User: api.User{
			Id:     user.ID.String(),
			Name:   user.Name,
			Avatar: *user.AvatarURL, // todo fix indirection
		},

		Lists: make(map[string]api.ListMetadata),
	}

	for _, list := range lists {
		response.Lists[list.ID.String()] = svc.listDomainService.BuildMetadata(list)
	}

	return response, nil
}
