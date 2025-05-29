package gio_router

import (
	"net/url"

	"github.com/oligo/gioview/theme"

	"gioui.org/layout"
)

type Widget func(gtx layout.Context, th *theme.Theme) layout.Dimensions

type BaseView struct {
	location *url.URL
	finished bool
}

type EmptyView struct{}

// A helper view which implements the RouteView interface.
type SimpleView struct {
	BaseView
	id            Route
	title         string
	w             Widget
	intentHandler func(intent Intent) error
}

func (base *BaseView) Id() Route { return Route{} }

func (base *BaseView) Title() string { return "Base" }

func (base *BaseView) OnIntent(intent Intent) error {
	loc := intent.Location()
	base.location = &loc
	return nil
}

func (base *BaseView) OnFinish() {
	base.location = nil
	base.finished = true
	return
}

func (base *BaseView) Finished() bool {
	return base.finished
}

func (base *BaseView) Location() url.URL {
	return *base.location
}

func (base *BaseView) Layout(gtx layout.Context, th *theme.Theme) layout.Dimensions {
	return layout.Dimensions{}
}

func (sv *SimpleView) Id() Route {
	return sv.id
}

func (sv *SimpleView) Title() string {
	return sv.title
}

func (sv *SimpleView) OnIntent(intent Intent) error {
	err := sv.BaseView.OnIntent(intent)
	if err != nil {
		return err
	}

	return sv.intentHandler(intent)
}

func (sv *SimpleView) Location() url.URL {
	return *sv.BaseView.location
}

func (sv *SimpleView) Layout(gtx layout.Context, th *theme.Theme) layout.Dimensions {
	return sv.w(gtx, th)
}

func Simple(id Route, title string, w Widget, intentHandler func(intent Intent) error) RouteView {
	return &SimpleView{
		id:            id,
		title:         title,
		w:             w,
		intentHandler: intentHandler,
	}
}

func (v EmptyView) Layout(gtx layout.Context, th *theme.Theme) layout.Dimensions {
	return layout.Dimensions{Size: gtx.Constraints.Max}
}

func (v EmptyView) OnIntent(intent Intent) error {
	return nil
}

func (v EmptyView) Id() Route {
	return NewRoute("Blank")
}

func (v EmptyView) Title() string {
	return "Blank"
}

func (v EmptyView) Location() url.URL {
	return buildURL(v.Id(), nil)
}
