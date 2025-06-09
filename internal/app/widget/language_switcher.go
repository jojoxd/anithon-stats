package widget

import (
	"context"
	"fmt"
	"image"

	"gioui.org/io/event"
	"gioui.org/io/pointer"
	"gioui.org/layout"
	"gioui.org/op/clip"
	"gioui.org/unit"
	"gioui.org/widget/material"
	"golang.org/x/text/language"

	"anistats/internal/app/core"
	"anistats/pkg/gio_router"
)

type LanguageSwitcher struct {
	list  layout.List
	items []*LanguageItem
}

func NewLanguageSwitcher() LanguageSwitcher {
	return LanguageSwitcher{
		list: layout.List{
			Axis: layout.Vertical,
		},
	}
}

func (ls *LanguageSwitcher) Layout(ctx context.Context) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)
	app := core.AppFromContext(ctx)
	th := core.ThemeFromContext(ctx)

	lm := app.LocalizerManager()
	languages := lm.Languages()
	if ls.items == nil {
		ls.items = make([]*LanguageItem, 0)
		for _, lang := range languages {
			ls.items = append(ls.items, &LanguageItem{
				language:         lang,
				localizerManager: lm,
				pressed:          false,
			})
		}
	}

	return ls.list.Layout(gtx, len(ls.items), func(gtx layout.Context, index int) layout.Dimensions {
		return layout.UniformInset(unit.Dp(16)).Layout(gtx, func(gtx layout.Context) layout.Dimensions {
			return ls.items[index].Layout(gtx, th)
		})
	})
}

type LanguageItem struct {
	pressed          bool
	language         language.Tag
	localizerManager core.LocalizerManager
}

func (li *LanguageItem) Layout(gtx layout.Context, th *material.Theme) layout.Dimensions {
	langLocalizer, err := li.localizerManager.LocalizerForLanguage(li.language)
	if err != nil {
		panic(err)
	}

	title := langLocalizer.T(fmt.Sprintf("core.language.%s", li.language.String()))
	subtitle := li.localizerManager.Localizer().T(fmt.Sprintf("core.language.%s", li.language.String()))

	dims := layout.Flex{Axis: layout.Vertical}.Layout(gtx,
		layout.Rigid(material.Body1(th, title).Layout),
		layout.Rigid(material.Body2(th, subtitle).Layout),
	)

	area := clip.Rect(image.Rect(0, 0, dims.Size.X, dims.Size.Y)).Push(gtx.Ops)
	area.Pop()

	event.Op(gtx.Ops, li)
	for {
		if _, ok := li.handleEvent(gtx); !ok {
			break
		}
	}

	return dims
}

func (li *LanguageItem) handleEvent(gtx layout.Context) (event.Event, bool) {
	e, ok := gtx.Event(pointer.Filter{
		Target: li,
		Kinds:  pointer.Press | pointer.Release,
	})

	if !ok {
		return e, ok
	}

	ev, ok := e.(pointer.Event)
	if !ok {
		return e, ok
	}

	//goland:noinspection GoSwitchMissingCasesForIotaConsts
	switch ev.Kind {
	case pointer.Press:
		li.pressed = true

		fmt.Printf("Pressed %s\n", li.language.String())

	case pointer.Release:
		li.pressed = false

		fmt.Printf("Released %s\n", li.language.String())

		// debug, should be abstracted
		err := li.localizerManager.SetLocale(li.language)
		if err != nil {
			panic(err)
		}
	}

	return e, ok
}
