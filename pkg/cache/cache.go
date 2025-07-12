package cache

import (
	"errors"
)

var (
	Err = errors.New("cache")
)

type GetterFunc func(string) ([]byte, error)

type Cache interface {
	Store
	GetFunc(key string, fn GetterFunc) ([]byte, error)
}

type cache struct {
	Store
}

func New(store Store) Cache {
	return &cache{
		Store: store,
	}
}

func (c *cache) GetFunc(key string, fn GetterFunc) ([]byte, error) {
	has, err := c.Store.Has(key)
	if err != nil {
		return nil, err
	}
	if has {
		return c.Store.Get(key)
	}

	bytes, err := fn(key)
	if err != nil {
		return nil, err
	}

	if err := c.Store.Put(key, bytes); err != nil {
		return nil, err
	}

	return bytes, nil
}
