package core

import (
	"github.com/nicksnyder/go-i18n/v2/i18n"

	v1 "anistats/api/v1"
)

type Localizer interface {
	// T translates a key
	T(key string) string

	// Tf translates a key with formatting (template data)
	Tf(key string, templateData interface{}) string

	// Tc translates a key with a pluralCount
	Tc(key string, pluralCount interface{}) string

	// Tfc translates a key with a pluralCount and formatting (template data)
	Tfc(key string, pluralCount interface{}, templateData interface{}) string

	// TTv1 translates a v1.Translatable
	TTv1(translatable v1.Translatable) string

	// PageTitle translates an application page title
	PageTitle(key string, templateData interface{}) string

	// Inner returns the inner i18n.Localizer instance
	Inner() *i18n.Localizer
}
