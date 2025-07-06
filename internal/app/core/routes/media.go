package routes

import (
	"git.jojoxd.nl/projects/go-giorno/router/route"

	v1 "anistats/api/v1"
	"anistats/internal/app/features/media/screens"
)

var Media = route.NewTyped[v1.MediaId]("media.media")

var MediaOverview = route.New("media.overview")

var MediaSearch = route.NewTyped[screens.SearchParams]("media.search")
