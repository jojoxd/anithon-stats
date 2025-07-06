package routes

import (
	"git.jojoxd.nl/projects/go-giorno/router/route"

	v1 "anistats/api/v1"
)

var UserLists = route.NewTyped[v1.UserId]("user.lists")

var UserOverview = route.NewTyped[v1.UserId]("user.overview")

var UserSearch = route.New("user.search")
