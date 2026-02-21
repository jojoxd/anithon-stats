package screens

import (
	"gioui.org/layout"
	"gioui.org/widget/material"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

type Overview struct {
	app core.Application
}

func NewOverview(app core.Application) *Overview {
	return &Overview{app: app}
}

func (o Overview) Layout(gtx layout.Context, user v1.User) layout.Dimensions {
	th := o.app.Theme()

	return material.Body1(th.Material(), user.Name).Layout(gtx)
}
