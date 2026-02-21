package theme

import (
	"image/color"

	"gioui.org/widget/material"
)

type Theme struct {
	material *material.Theme

	surface   color.NRGBA
	onSurface color.NRGBA

	primary   color.NRGBA
	onPrimary color.NRGBA

	secondary   color.NRGBA
	onSecondary color.NRGBA
}

func New(palette *Palette) *Theme {
	th := &Theme{
		material: material.NewTheme(),
	}

	palette.Apply(th)

	return th
}

func (t Theme) Material() *material.Theme {
	return t.material
}

func (t Theme) Surface() color.NRGBA {
	return t.surface
}

func (t Theme) OnSurface() color.NRGBA {
	return t.onSurface
}

func (t Theme) Primary() color.NRGBA {
	return t.primary
}

func (t Theme) OnPrimary() color.NRGBA {
	return t.onPrimary
}

func (t Theme) Secondary() color.NRGBA {
	return t.secondary
}

func (t Theme) OnSecondary() color.NRGBA {
	return t.onSecondary
}
