package language_switcher

import (
	"fmt"
	"image"

	"gioui.org/io/event"
	"gioui.org/io/input"
	"gioui.org/io/pointer"
	"gioui.org/layout"
	"gioui.org/op/clip"
	"gioui.org/unit"
	"gioui.org/widget/material"

	"anistats/pkg/giorno/localizer"
	"anistats/pkg/giorno/utils/inset"
)

type ItemWidget struct {
	locale           localizer.Locale
	localizerManager localizer.Manager
	pressed          bool
	OnClick          func()
	title            string
	subtitle         string
}

func (i *ItemWidget) Layout(gtx layout.Context, th *material.Theme) layout.Dimensions {
	dimensions := gkinset.Horizontal(unit.Dp(4), func(gtx layout.Context) layout.Dimensions {
		return layout.Flex{Axis: layout.Vertical}.Layout(gtx,
			layout.Rigid(
				gkinset.Vertical(4, material.Body1(th, i.title).Layout),
			),
			layout.Rigid(
				gkinset.Vertical(2, material.Body2(th, i.subtitle).Layout),
			),
		)
	})(gtx)

	rect := image.Rect(0, 0, dimensions.Size.X, dimensions.Size.Y)
	defer clip.Rect(rect).Op().Push(gtx.Ops).Pop()
	event.Op(gtx.Ops, i)

	return dimensions
}

func (i *ItemWidget) Update(q input.Source) {
	i.handleEvents(q)

	i.title = i.localizerManager.Localizer().T(fmt.Sprintf("core.language.%s", i.locale.String()))

	subtitleLocalizer, err := i.localizerManager.LocalizerFor(i.locale)
	if err == nil {
		i.subtitle = subtitleLocalizer.T(fmt.Sprintf("core.language.%s", i.locale.String()))
	}
}

func (i *ItemWidget) handleEvents(q input.Source) {
	for {
		e, ok := q.Event(pointer.Filter{
			Target: i,
			Kinds:  pointer.Press | pointer.Release,
		})

		if !ok {
			return
		}

		switch ev := e.(type) {
		case pointer.Event:
			i.handlePointerEvent(ev)
		}
	}
}

func (i *ItemWidget) handlePointerEvent(ev pointer.Event) {
	switch ev.Kind {
	case pointer.Press:
		i.pressed = true
		i.OnClick()

	case pointer.Release:
		i.pressed = false
	}
}
