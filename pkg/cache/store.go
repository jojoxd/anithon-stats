package cache

import "io"

type Store interface {
	Has(key string) (bool, error)
	Get(key string) ([]byte, error)
	GetReader(key string) (io.ReadCloser, error)
	Put(key string, data []byte) error
	Delete(key string) error
}
