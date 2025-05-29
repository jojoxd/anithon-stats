package widget

import (
	"context"
	"fmt"

	"gioui.org/layout"
	"gioui.org/op"

	"anistats/pkg/gio_router"
)

type AsyncLoaderConfig[T, D any] struct {
	Loading func(ctx context.Context) layout.Dimensions
	Loaded  func(ctx context.Context, data T) layout.Dimensions
	Load    func(ctx D) (T, error)
}

// AsyncLoader is a very ugly implementation of flutter's implementation
type AsyncLoader[T, D any] struct {
	cfg AsyncLoaderConfig[T, D]

	loading bool
	data    T
}

func NewAsyncLoader[T, D any](cfg AsyncLoaderConfig[T, D]) AsyncLoader[T, D] {
	return AsyncLoader[T, D]{cfg: cfg}
}

func (ldr *AsyncLoader[T, D]) Layout(ctx context.Context) layout.Dimensions {
	gtx := gio_router.GtxFromContext(ctx)

	if ldr.loading {
		gtx.Execute(op.InvalidateCmd{})

		return ldr.cfg.Loading(ctx)
	}

	return ldr.cfg.Loaded(ctx, ldr.data)
}

func (ldr *AsyncLoader[T, D]) Load(d D) {
	ldr.loading = true
	fmt.Printf("start loading\n")

	go func() {
		data, err := ldr.cfg.Load(d)
		if err != nil {
			panic(err)
		}

		fmt.Printf("loaded %+v\n", data)

		ldr.data = data
		ldr.loading = false
	}()
}
