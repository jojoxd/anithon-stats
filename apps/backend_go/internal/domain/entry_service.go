package domain

import (
	"context"
	"fmt"
	"slices"

	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
)

type EntryService struct{}

func NewEntryService() *EntryService {
	return &EntryService{}
}

func (svc EntryService) AssignMut(mut *ent.ListEntryMutation, seriesID, listID uuid.UUID, entry generated.MediaListEntry) {
	mut.SetAnilistID(uint(entry.Id))

	mut.SetSeriesID(seriesID)
	mut.SetListID(listID)

	mut.SetProgress(uint(entry.Progress))
	mut.SetState(convEntryStatus(entry.Status))
}

func (svc EntryService) ToList(ctx context.Context, list *ent.List) api.EntryList {
	entryList := api.EntryList{
		Items: make([]api.Entry, len(list.Edges.Entries)),
		Data:  make([]api.EntryData, len(list.Edges.Entries)),
	}

	for i, entry := range list.Edges.Entries {
		var sequelRef *api.EntryRef
		sequelEntry, err := svc.GetSequelEntry(ctx, list, entry)
		if err == nil && sequelEntry != nil {
			sequelRef = &api.EntryRef{Ref: sequelEntry.ID.String()}

			fmt.Printf("ENTRY(%s).SEQUEL = %s", entry.ID.String(), sequelEntry.ID.String())
		}

		entryList.Items[i] = api.Entry{
			Id:                 entry.ID.String(),
			SeriesRef:          api.SeriesRef{Id: entry.Edges.Series.ID.String()},
			Episodes:           int64(entry.Edges.Series.Episodes), // todo remove cast
			HasJoinedLastChunk: false,                              // todo needs to be calculated?
			Stats:              api.EntryStats{Chunks: 0, Time: 0},
			Progress:           int64(entry.Progress), // todo remove cast
			Status:             entry.State,
			SequelRef:          sequelRef,
			CustomSequelRef:    nil, // todo
		}

		entryList.Data[i] = api.EntryData{
			Ref:              entry.ID.String(),
			Mult:             entry.Multiplier,
			Order:            new(i), // todo: entry.Order, // todo remove cast
			Split:            nil,    // todo: entry.Split, // todo remove cast
			SplitSequelEntry: entry.SplitSequelEntry,
			StartAt:          0, // todo: entry.StartAt
		}
	}

	return entryList
}

func (svc EntryService) GetSequelEntry(ctx context.Context, list *ent.List, entry *ent.ListEntry) (*ent.ListEntry, error) {
	sequels, err := entry.Edges.Series.QuerySequels().All(ctx)
	if err != nil {
		return nil, err
	}

	index := slices.IndexFunc(list.Edges.Entries, func(listEntry *ent.ListEntry) bool {
		return slices.IndexFunc(sequels, func(sequelEntity *ent.Series) bool {
			return sequelEntity.ID == listEntry.Edges.Series.ID
		}) > -1
	})

	if index > -1 {
		return list.Edges.Entries[index], nil
	}

	return nil, nil
}

func convEntryStatus(mediaListStatus generated.MediaListStatus) api.EntryStatus {
	switch mediaListStatus {
	case generated.MediaListStatusCurrent:
		return api.EntryStatusCurrent
	case generated.MediaListStatusPlanning:
		return api.EntryStatusPlanning
	case generated.MediaListStatusCompleted:
		return api.EntryStatusCompleted
	case generated.MediaListStatusDropped:
		return api.EntryStatusDropped
	case generated.MediaListStatusPaused:
		return api.EntryStatusPaused
	case generated.MediaListStatusRepeating:
		return api.EntryStatusRepeating
	}

	panic("unhandled entry status")
}
