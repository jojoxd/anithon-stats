package v1

import "image"

type MediaId string

type Media interface {
	GetId() MediaId

	GetDisplayName() Translatable

	CoverArt() image.Image
}
