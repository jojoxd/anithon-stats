package colorlib

import (
	"fmt"
	"testing"
)

var representationTable = map[string]struct {
	color  Color
	uint32 uint32
}{
	"#00000000": {
		color:  Color{R: 0x00, G: 0x00, B: 0x00},
		uint32: 0x00000000,
	},
	"#FF00FF00": {
		color:  Color{R: 0xFF, G: 0x00, B: 0xFF},
		uint32: 0xFF00FF00,
	},
	"#00112233": {
		color:  Color{R: 0x00, G: 0x11, B: 0x22, A: 0x33},
		uint32: 0x00112233,
	},
	"#12345678": {
		color:  Color{R: 0x12, G: 0x34, B: 0x56, A: 0x78},
		uint32: 0x12345678,
	},
}

func TestRepresentation(t *testing.T) {
	t.Parallel()

	for hexColor, tt := range representationTable {
		t.Run(fmt.Sprintf("%s as uint32", hexColor), func(t *testing.T) {
			actual := tt.color.Uint32()

			if actual != tt.uint32 {
				t.Errorf("got %x, want %x", actual, tt.uint32)
			}
		})

		t.Run(fmt.Sprintf("%s as hex string", hexColor), func(t *testing.T) {
			actual := tt.color.HexString()

			if actual != hexColor {
				t.Errorf("got %s, want %s", actual, hexColor)
			}
		})
	}
}
