package gio_router

import "net/url"

type Intent struct {
	Target  Route
	Params  RouteParams
	Referer url.URL
	// indicates the provider to create a new view instance and show up
	// in a new tab
	RequireNew bool
}

func (i Intent) Location() url.URL {
	return buildURL(i.Target, i.Params)
}
