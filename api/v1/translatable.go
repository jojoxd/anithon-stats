package v1

import "golang.org/x/text/language"

type Translatable interface {
	// ForLanguage returns the translation for a specific language
	// It will fall back onto other languages if required
	ForLanguage(lang language.Tag) string
}
