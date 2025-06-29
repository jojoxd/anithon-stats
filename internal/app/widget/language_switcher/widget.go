package language_switcher

import (
	"image"
	"image/color"

	"gioui.org/io/input"
	"gioui.org/layout"
	"gioui.org/op/clip"
	"gioui.org/op/paint"
	"gioui.org/widget/material"
	"golang.org/x/image/colornames"

	"anistats/pkg/giorno/localizer"
)

type Widget struct {
	localizerManager localizer.Manager
	list             layout.List
	items            []*ItemWidget
}

func New(localizerManager localizer.Manager) *Widget {
	return &Widget{
		localizerManager: localizerManager,
		items:            nil,
		list: layout.List{
			Axis: layout.Vertical,
		},
	}
}

func (w *Widget) Layout(gtx layout.Context, th *material.Theme) layout.Dimensions {
	return w.list.Layout(gtx, len(w.items),
		func(gtx layout.Context, index int) layout.Dimensions {
			return layout.Flex{Axis: layout.Vertical}.Layout(gtx,
				layout.Rigid(func(gtx layout.Context) layout.Dimensions {
					return w.items[index].Layout(gtx, th)
				}),
				layout.Rigid(func(gtx layout.Context) layout.Dimensions {
					defer clip.Rect{Max: image.Pt(gtx.Constraints.Max.X, 1)}.Push(gtx.Ops).Pop()
					paint.ColorOp{Color: color.NRGBAModel.Convert(colornames.Lightgray).(color.NRGBA)}.Add(gtx.Ops)
					paint.PaintOp{}.Add(gtx.Ops)

					return layout.Dimensions{Size: image.Pt(gtx.Constraints.Max.X, 1)}
				}),
			)
		},
	)
}

func (w *Widget) Update(q input.Source) {
	if w.items == nil {
		locales := w.localizerManager.Locales()
		w.items = make([]*ItemWidget, len(locales))
		for i, locale := range locales {
			w.items[i] = &ItemWidget{
				locale:           locale,
				localizerManager: w.localizerManager,
				OnClick: func() {
					w.onLocaleSelected(locale)
				},
			}
		}
	}

	for _, item := range w.items {
		item.Update(q)
	}
}

func (w *Widget) onLocaleSelected(locale localizer.Locale) {
	err := w.localizerManager.SetLocale(locale)
	if err != nil {
		panic(err)
	}
}
