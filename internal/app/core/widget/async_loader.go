package widget

import (
	"fmt"

	"gioui.org/layout"
	"gioui.org/op"
	"github.com/oligo/gioview/theme"
)

type AsyncLoaderConfig[T, D any] struct {
	Loading func(gtx layout.Context, th *theme.Theme) layout.Dimensions
	Loaded  func(gtx layout.Context, th *theme.Theme, data T) layout.Dimensions
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

func (ldr *AsyncLoader[T, D]) Layout(gtx layout.Context, th *theme.Theme) layout.Dimensions {
	if ldr.loading {
		fmt.Printf("invalidated\n")
		gtx.Execute(op.InvalidateCmd{})

		return ldr.cfg.Loading(gtx, th)
	}

	return ldr.cfg.Loaded(gtx, th, ldr.data)
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
