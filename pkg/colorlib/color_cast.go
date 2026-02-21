package colorlib

import (
	"fmt"
	"image/color"
)

var _ color.Color = (*Color)(nil)

// RGBA gets the color.RGBA instance
func (c *Color) RGBA() (r, g, b, a uint32) {
	// Ensure we are in denormalized space
	cast := color.RGBAModel.Convert(color.NRGBA(*c)).(color.RGBA)

	// And return that to be color.Color-compatible
	return cast.RGBA()
}

// NRGBA gets the color.NRGBA instance.
func (c *Color) NRGBA() color.NRGBA {
	return color.NRGBA(*c)
}

// Uint32 converts this color to a uint32 representation
func (c *Color) Uint32() uint32 {
	return uint32(c.R)<<24 | uint32(c.G)<<16 | uint32(c.B)<<8 | uint32(c.A)
}

func (c *Color) HexString() string {
	return fmt.Sprintf("#%08X", c.Uint32())
}
