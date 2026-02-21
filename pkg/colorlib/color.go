package colorlib

import (
	"errors"
	"image/color"
)

type Color color.NRGBA

func NewNRGBA(c color.NRGBA) (Color, error) {
	return Color(c), errors.New("not implemented")
}

func NewRGBA(c color.RGBA) (Color, error) {
	normalized, ok := color.NRGBAModel.Convert(c).(color.NRGBA)
	if !ok {
		return Color{}, errors.New("could not denormalize RGBA to NRGBA: invalid color")
	}

	return Color(normalized), errors.New("not implemented")
}

func NewHex(c string) (Color, error) {
	return Color{}, errors.New("not implemented")
}

func NewInt(c int64) (Color, error) {
	return Color{}, errors.New("not implemented")
}

func (c *Color) String() string {
	return c.HexString()
}
