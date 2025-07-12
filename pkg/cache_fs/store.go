package cache_fs

import (
	"errors"
	"fmt"
	"io"
	"log/slog"
	"os"
	"path"

	"github.com/spf13/afero"

	"anistats/pkg/cache"
)

var (
	Err               = errors.New("fs-store")
	ErrInvalidConfig  = fmt.Errorf("%w: invalid config", Err)
	ErrNotImplemented = fmt.Errorf("%w: not implemented", Err)
)

var _ cache.Store = (*Store)(nil)

type Store struct {
	*config
	fs afero.Fs
}

func New(options ...Option) (*Store, error) {
	config, err := newConfig(options...)
	if err != nil {
		return nil, fmt.Errorf("%w: %w", ErrInvalidConfig, err)
	}

	osfs := afero.NewOsFs()
	if err := osfs.MkdirAll(config.directory, os.ModeDir|0700); err != nil {
		return nil, fmt.Errorf("%w: %w", ErrInvalidConfig, err)
	}

	slog.Info("cache directory", "directory", config.directory)

	store := &Store{
		config: config,
		fs:     afero.NewBasePathFs(osfs, config.directory),
	}

	return store, nil
}

func (f *Store) Has(key string) (bool, error) {
	err := f.mkdir(key)
	if err != nil {
		return false, err
	}

	_, err = f.fs.Stat(key)
	if errors.Is(err, os.ErrNotExist) {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func (f *Store) Get(key string) ([]byte, error) {
	r, err := f.fs.Open(key)
	if err != nil {
		return nil, err
	}

	slog.Info("cache hit", "key", key)

	defer r.Close()
	return io.ReadAll(r)
}

func (f *Store) GetReader(key string) (io.ReadCloser, error) {
	r, err := f.fs.Open(key)
	if err != nil {
		return nil, err
	}

	return r, nil
}

func (f *Store) Put(key string, data []byte) error {
	err := f.mkdir(key)
	if err != nil {
		return err
	}

	file, err := f.fs.OpenFile(key, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		return err
	}

	if _, err := file.Write(data); err != nil {
		return err
	}

	if err := file.Close(); err != nil {
		return err
	}

	slog.Info("cache put", "key", key)

	return nil
}

func (f *Store) Delete(key string) error {
	return f.fs.Remove(key)
}

func (f *Store) mkdir(key string) error {
	dir := path.Dir(key)
	err := f.fs.MkdirAll(dir, os.ModeDir|0700)
	if err != nil {
		return fmt.Errorf("%w: %w", Err, err)
	}

	slog.Info("created directory", "dir", dir)

	return nil
}
