package routes

import (
	"git.jojoxd.nl/projects/go-giorno/router/route"
	"github.com/google/uuid"
)

var UserLists = route.NewTyped[uuid.UUID]("user.lists")

var UserOverview = route.NewTyped[uuid.UUID]("user.overview")

var UserSearch = route.New("user.search")
