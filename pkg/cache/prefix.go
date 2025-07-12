package cache

import (
	"fmt"
	"io"
)

var _ Cache = (*Prefix)(nil)

type Prefix struct {
	prefix string
	inner  Cache
}

func NewPrefix(prefix string, inner Cache) *Prefix {
	return &Prefix{
		prefix: prefix,
		inner:  inner,
	}
}

func (c *Prefix) Get(key string) ([]byte, error) {
	return c.inner.Get(c.withPrefix(key))
}

func (c *Prefix) GetReader(key string) (io.ReadCloser, error) {
	return c.inner.GetReader(c.withPrefix(key))
}

func (c *Prefix) GetFunc(key string, fn GetterFunc) ([]byte, error) {
	return c.inner.GetFunc(c.withPrefix(key), fn)
}

func (c *Prefix) Put(key string, value []byte) error {
	return c.inner.Put(c.withPrefix(key), value)
}

func (c *Prefix) Has(key string) (bool, error) {
	return c.inner.Has(c.withPrefix(key))
}

func (c *Prefix) Delete(key string) error {
	return c.inner.Delete(c.withPrefix(key))
}

func (c *Prefix) withPrefix(key string) string {
	return fmt.Sprintf("%s/%s", c.prefix, key)
}
