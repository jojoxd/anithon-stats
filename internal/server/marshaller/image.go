package marshaller

import (
	"bytes"
	"image"
	"image/png"

	"anistats/pkg/cache"
)

var _ cache.Marshaller[image.Image] = (*Image)(nil)

type Image struct{}

func (Image) MarshalCache(i image.Image) ([]byte, error) {
	buf := bytes.NewBuffer([]byte{})
	err := png.Encode(buf, i)
	return buf.Bytes(), err
}

func (Image) UnmarshalCache(b []byte) (image.Image, error) {
	return png.Decode(bytes.NewReader(b))
}
