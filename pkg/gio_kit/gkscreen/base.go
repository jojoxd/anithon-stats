package gkscreen

import "gioui.org/layout"

type Screen struct {
	spec ScreenSpec
}

type ScreenSpec struct {
	Drawer   layout.Widget
	TitleBar layout.Widget
	Main     layout.Widget
}

func NewScreen(spec ScreenSpec) *Screen {
	return &Screen{
		spec: spec,
	}
}

func (s *Screen) Layout(gtx layout.Context) layout.Dimensions {
	return s.layoutTitleBar(gtx, func(gtx layout.Context) layout.Dimensions {
		return s.layoutDrawer(gtx, s.spec.Main)
	})
}

func (s *Screen) layoutDrawer(gtx layout.Context, slot layout.Widget) layout.Dimensions {
	var items = make([]layout.FlexChild, 0)

	if s.spec.Drawer != nil {
		items = append(items, layout.Rigid(s.spec.Drawer))
	}

	items = append(items, layout.Flexed(1, slot))

	l := layout.Flex{
		Axis: layout.Horizontal,
	}

	return l.Layout(gtx, items...)
}

func (s *Screen) layoutTitleBar(gtx layout.Context, slot layout.Widget) layout.Dimensions {
	var items = make([]layout.FlexChild, 0)

	if s.spec.TitleBar != nil {
		items = append(items, layout.Rigid(s.spec.TitleBar))
	}

	items = append(items, layout.Flexed(1, slot))

	l := layout.Flex{
		Axis: layout.Vertical,
	}

	return l.Layout(gtx, items...)
}
