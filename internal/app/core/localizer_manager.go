package core

import "golang.org/x/text/language"

type LocalizerManager interface {
	SetLocale(lang language.Tag) error
	LocalizerForLanguage(lang language.Tag) (Localizer, error)
	Localizer() Localizer
	Languages() []language.Tag
}
