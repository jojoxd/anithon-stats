package cache

import "io"

// var (
// 	ErrMarshalFailed   = fmt.Errorf("%w: failed to marshal", Err)
// 	ErrUnmarshalFailed = fmt.Errorf("%w: failed to unmarshal", Err)
// )

type Marshaller[T any] interface {
	MarshalCache(t T) ([]byte, error)
	UnmarshalCache([]byte) (T, error)
}

type MarshalGetterFunc[V any] func(key string) (V, error)

type Marshal[V any] struct {
	inner      Cache
	marshaller Marshaller[V]
}

func NewMarshal[V any](marshaller Marshaller[V], inner Cache) *Marshal[V] {
	return &Marshal[V]{
		inner:      inner,
		marshaller: marshaller,
	}
}

func (mc *Marshal[V]) Has(key string) (bool, error) {
	return mc.inner.Has(key)
}

func (mc *Marshal[V]) Get(key string) (V, error) {
	bytes, err := mc.inner.Get(key)
	if err != nil {
		return *new(V), err
	}

	return mc.marshaller.UnmarshalCache(bytes)
}

func (mc *Marshal[V]) GetReader(key string) (io.ReadCloser, error) {
	return mc.inner.GetReader(key)
}

func (mc *Marshal[V]) GetFunc(key string, fn MarshalGetterFunc[V]) (V, error) {
	bytes, err := mc.inner.GetFunc(key, func(key string) ([]byte, error) {
		value, err := fn(key)
		if err != nil {
			return nil, err
		}

		return mc.marshaller.MarshalCache(value)
	})

	if err != nil {
		return *new(V), err
	}

	return mc.marshaller.UnmarshalCache(bytes)
}

func (mc *Marshal[V]) Put(key string, value V) error {
	bytes, err := mc.marshaller.MarshalCache(value)
	if err != nil {
		return err
	}

	return mc.inner.Put(key, bytes)
}
