package core

import "gioui.org/widget/material"

const AppContextKey = "app"

type Application interface {
	Loop() error
	Localizer() Localizer
	Theme() *material.Theme
}
