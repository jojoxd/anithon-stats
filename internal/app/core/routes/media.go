package routes

import (
	"git.jojoxd.nl/projects/go-giorno/router/route"
	"github.com/google/uuid"

	"anistats/internal/app/features/media/screens"
)

var Media = route.NewTyped[uuid.UUID]("media.media")

var MediaOverview = route.New("media.overview")

var MediaSearch = route.NewTyped[screens.SearchParams]("media.search")
