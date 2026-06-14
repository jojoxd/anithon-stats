package domain

import (
	"time"

	"git.jojoxd.nl/projects/aslog"
	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/ent"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
)

type ListService struct {
	logger *aslog.Logger
}

func NewListService(logger *aslog.Logger) *ListService {
	return &ListService{
		logger: logger,
	}
}

// func (svc ListService) NewFromAnilist(user *ent.User, allist generated.MediaList) *entity.List {
// 	return &entity.List{
// 		Name:   allist.Name,
// 		UserID: user.ID,
// 		User:   user,
// 		Settings: &entity.ListSettings{
// 			StackSize:          0,
// 			AllowChunkMerge:    false,
// 			MaxChunkLength:     0,
// 			MaxChunkJoinLength: 0,
// 		},
// 		Entries: nil,
// 	}
// }
//
// func (svc ListService) UpdateFromAnilist(list *entity.List, allist generated.MediaList) {
// 	// noop
// }

func (svc ListService) AssignMut(mut *ent.ListMutation, allist generated.MediaList, userID uuid.UUID) {
	mut.SetName(allist.Name)
	mut.SetOwnerID(userID)

	// todo
	mut.SetDescription("TODO")
}

func (svc ListService) BuildMetadata(list *ent.List) api.ListMetadata {
	return api.ListMetadata{
		Title:       list.Name,
		Ref:         api.ListRef{Id: list.ID.String()},
		Description: "TODO", // todo
		Stats:       svc.BuildMetadataStats(list),
	}
}

func (svc ListService) BuildMetadataStats(list *ent.List) api.ListMetadataStats {
	duration := 0.0
	for _, entry := range list.Edges.Entries {
		duration += svc.calculateEntryDuration(entry)
	}

	svc.logger.Debug("calculated list duration", "duration", duration, "list", list, "entries", list.Edges.Entries)

	return api.ListMetadataStats{
		Time: int64(duration),
	}
}

func (svc ListService) calculateEntryDuration(entry *ent.ListEntry) float64 {
	episodes := entry.Edges.Series.Episodes
	if entry.StartAt != nil {
		episodes -= *entry.StartAt
	}

	seriesDuration := (entry.Edges.Series.Duration * time.Duration(episodes)).Minutes()

	return seriesDuration * entry.Multiplier
}
