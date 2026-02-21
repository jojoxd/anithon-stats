package colorlib

import "encoding/json"

// Marshalling (JSON)

var _ json.Marshaler = (*Color)(nil)
var _ json.Unmarshaler = (*Color)(nil)

func (c *Color) MarshalJSON() ([]byte, error) {
	// todo: implement Color#MarshalJSON
	panic("not implemented")
}

func (c *Color) UnmarshalJSON(value []byte) error {
	// todo: implement Color#UnmarshalJSON
	panic("not implemented")
}
