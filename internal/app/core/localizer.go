package core

import (
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

type Localizer interface {
	T(key string) string
	Tf(key string, templateData interface{}) string
	Tc(key string, pluralCount interface{}) string
	Tfc(key string, pluralCount interface{}, templateData interface{}) string
	Inner() *i18n.Localizer
}
