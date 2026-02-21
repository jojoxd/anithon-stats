package colorlib

import "errors"

// Gradient generates a gradient.
// t should be between 0 and 1, inclusive.
//
// This method will generate an error when t is outside 0..1,
// The error can be ignored, and the value will be clamped.
func Gradient(c1, c2 Color, t float32) (Color, error) {
	return Color{}, errors.New("not implemented")
}

func MustGradient(c1, c2 Color, t float32) Color {
	c, err := Gradient(c1, c2, t)
	if err != nil {
		panic(err)
	}

	return c
}
