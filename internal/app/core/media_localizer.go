package core

import (
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
)

type MediaLocalizer interface {
	SetLocale(locale language.Tag) error
	T(t v1.Translatable) string
}
