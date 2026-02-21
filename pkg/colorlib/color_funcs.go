package colorlib

import "image/color"

// Darken darkens a color by a specified delta.
// The range of t should be 0..1, inclusive
func Darken(c color.NRGBA, t float32) Color {
	// todo: implement Color#Darken
	panic("not implemented")
}

// Lighten lightens a color by a specified delta.
// // The range of t should be 0..1, inclusive
func Lighten(c color.NRGBA, t float32) Color {
	// todo: implement Color#Lighten
	panic("not implemented")
}

// Mix mixes a color with another color by a specified delta.
// // The range of t should be 0..1, inclusive
func Mix(c1, c2 color.NRGBA, t float32) Color {
	// todo: implement Color#Mix
	panic("not implemented")
}

// Add adds 2 colors together.
func Add(c1, c2 color.NRGBA) Color {
	// todo: implement Color#Add
	panic("not implemented")
}

// Subtract subtracts c2 from c1.
func Subtract(c1, c2 color.NRGBA) Color {
	// todo: implement Color#Subtract
	panic("not implemented")
}
