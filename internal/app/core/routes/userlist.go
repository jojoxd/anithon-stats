package routes

import (
	"git.jojoxd.nl/projects/go-giorno/router/route"

	v1 "anistats/api/v1"
)

var UserListOverview = route.NewTyped[v1.UserListId]("userlist.overview")

var UserListCopy = route.NewTyped[v1.UserListId]("userlist.copy")

var UserListEdit = route.NewTyped[v1.UserListId]("userlist.edit")

var UserListPlayer = route.NewTyped[v1.UserListId]("userlist.player")
