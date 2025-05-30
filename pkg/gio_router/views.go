package gio_router

import (
	"context"

	"gioui.org/layout"
)

type Widget func(gtx layout.Context) layout.Dimensions

type BaseView struct {
	location RouteLocation
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
	base.location = intent.Location()
	return nil
}

func (base *BaseView) OnFinish() {
	base.location = "nil" // todo should be an actual nil
	base.finished = true
	return
}

func (base *BaseView) Finished() bool {
	return base.finished
}

func (base *BaseView) Location() RouteLocation {
	return base.location
}

func (base *BaseView) Layout(ctx context.Context) layout.Dimensions {
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

func (sv *SimpleView) Location() RouteLocation {
	return sv.BaseView.location
}

func (sv *SimpleView) Layout(ctx context.Context) layout.Dimensions {
	gtx := GtxFromContext(ctx)

	return sv.w(gtx)
}

func Simple(id Route, title string, w Widget, intentHandler func(intent Intent) error) RouteView {
	return &SimpleView{
		id:            id,
		title:         title,
		w:             w,
		intentHandler: intentHandler,
	}
}

func (v EmptyView) Layout(ctx context.Context) layout.Dimensions {
	gtx := GtxFromContext(ctx)

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

func (v EmptyView) Location() RouteLocation {
	return RouteLocation(buildURL(v.Id(), nil))
}
