package domain

import (
	"context"

	"git.jojoxd.nl/projects/aslog"

	"git.jojoxd.nl/projects/anistats/backend/ent"
	series2 "git.jojoxd.nl/projects/anistats/backend/ent/series"
	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
)

type SyncSeriesService struct {
	seriesService *SeriesService
	logger        *aslog.Logger
}

func NewSyncSeriesService(
	seriesService *SeriesService,
	logger *aslog.Logger,
) *SyncSeriesService {
	return &SyncSeriesService{
		seriesService: seriesService,
		logger:        logger,
	}
}

func (svc SyncSeriesService) SyncMediaFragment(ctx context.Context, tx *ent.Tx, media generated.MediaFragment) (*ent.Series, error) {
	svc.logger.Info("syncing media fragment", "fragment.id", media.Id, "fragment.title", media.Title.Romaji)

	series, err := tx.Series.Query().Where(series2.AnilistIDEQ(uint(media.Id))).Only(ctx)
	switch {
	case ent.IsNotFound(err):
		q := tx.Series.Create()
		svc.seriesService.Assign(q.Mutation(), media)

		return q.Save(ctx)

	case err != nil:
		return nil, err
	}

	q := series.Update()
	svc.seriesService.Assign(q.Mutation(), media)

	return q.Save(ctx)
}

func (svc SyncSeriesService) SyncMediaRelatedFragment(ctx context.Context, tx *ent.Tx, media generated.MediaRelatedFragment) (*ent.Series, error) {
	svc.logger.Info("syncing media-related fragment", "fragment.id", media.Id, "fragment.title", media.Title.Romaji)

	root, err := svc.SyncMediaFragment(ctx, tx, media.MediaFragment)
	if err != nil {
		return nil, err
	}

	prequels := make([]*ent.Series, 0)
	sequels := make([]*ent.Series, 0)

	for _, edge := range media.Relations.Edges {
		relation, err := svc.SyncMediaFragment(ctx, tx, edge.Node)
		if err != nil {
			return nil, err
		}

		switch edge.RelationType {
		case generated.MediaRelationPrequel:
			prequels = append(prequels, relation)

		case generated.MediaRelationSequel:
			sequels = append(sequels, relation)
		}
	}

	svc.logger.Info("media relations", "series.id", root.ID.String(), "prequels", prequels, "sequels", sequels)

	return tx.Series.UpdateOne(root).
		ClearPrequels().
		AddPrequels(prequels...).
		ClearSequels().
		AddSequels(sequels...).
		Save(ctx)
}
