package colorlib

// Darken darkens the color.
// It returns a new Color instance.
func (c *Color) Darken(pct float32) Color {
	return Darken(c.NRGBA(), pct)
}

// Lighten lightens the color by a specific percentage.
// It returns a new Color instance.
func (c *Color) Lighten(pct float32) Color {
	return Lighten(c.NRGBA(), pct)
}

// Mix mixes a color with another color.
// It returns a new Color instance
func (c *Color) Mix(other Color, pct float32) Color {
	return Mix(c.NRGBA(), other.NRGBA(), pct)
}

// Add adds a color to the current color.
// It returns a new Color instance
func (c *Color) Add(other Color) Color {
	return Add(c.NRGBA(), other.NRGBA())
}

// Subtract subtracts a color from the current color.
// It returns a new Color instance
func (c *Color) Subtract(other Color) Color {
	return Subtract(c.NRGBA(), other.NRGBA())
}
