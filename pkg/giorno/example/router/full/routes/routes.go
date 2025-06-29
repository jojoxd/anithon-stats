package routes

import (
	route2 "anistats/pkg/giorno/router2/route"
)

var HomePage = route2.New("home")
var SubPage = route2.New("sub")
var TypedPage = route2.NewTyped[string]("typed")
