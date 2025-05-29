package gio_router

import (
	"context"

	"gioui.org/layout"
)

const managerContextKey = "gio_router:manager"

type managerContext struct {
	manager Manager
	gtx     *layout.Context
}

func newContext(manager Manager, gtx *layout.Context, ctx context.Context) context.Context {
	inner := &managerContext{
		manager: manager,
		gtx:     gtx,
	}

	return context.WithValue(ctx, managerContextKey, inner)
}

func ManagerFromContext(ctx context.Context) Manager {
	if inner, ok := ctx.Value(managerContextKey).(*managerContext); ok {
		return inner.manager
	}

	panic("gio_router: wrong context")
}

func GtxFromContext(ctx context.Context) layout.Context {
	if inner, ok := ctx.Value(managerContextKey).(*managerContext); ok {
		return *inner.gtx
	}

	panic("gio_router: wrong context")
}
