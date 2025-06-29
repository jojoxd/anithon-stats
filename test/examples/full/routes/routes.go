package routes

import (
	"anistats/test/examples/full/pages"
	"anistats/test/route"
	"anistats/test/view"
)

var HomePageRoute = route.New("home", func() view.View {
	return &pages.HomePage{}
})
