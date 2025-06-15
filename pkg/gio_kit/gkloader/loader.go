package gkloader

import "context"

type Loader[TArg comparable, TData any] interface {
	Load(context.Context, TArg) (TData, error)
}
