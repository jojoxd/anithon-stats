package routes

import (
	"git.jojoxd.nl/projects/go-giorno/router/route"
	"github.com/google/uuid"
)

var UserListOverview = route.NewTyped[uuid.UUID]("userlist.overview")

var UserListCopy = route.NewTyped[uuid.UUID]("userlist.copy")

var UserListEdit = route.NewTyped[uuid.UUID]("userlist.edit")

var UserListPlayer = route.NewTyped[uuid.UUID]("userlist.player")
