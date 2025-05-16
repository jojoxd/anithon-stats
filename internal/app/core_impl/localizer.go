package core_impl

import (
	"log/slog"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

type localizer struct {
	language          language.Tag
	inner             *i18n.Localizer
	fallbackLocalizer *i18n.Localizer
}

func newLocalizer(language language.Tag, inner *i18n.Localizer, fallbackLocalizer *i18n.Localizer) *localizer {
	return &localizer{
		language:          language,
		inner:             inner,
		fallbackLocalizer: fallbackLocalizer,
	}
}

// T Localizes a key
func (l localizer) T(key string) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID: key,
	})
}

// Tf Localizes a key with formatting capabilities
func (l localizer) Tf(key string, templateData interface{}) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID:    key,
		TemplateData: templateData,
	})
}

// Tc Localizes a key with plural count capabilities
func (l localizer) Tc(key string, pluralCount interface{}) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID:   key,
		PluralCount: pluralCount,
	})
}

// Tfc Localizes a key with plural count and formatting capabilities
func (l localizer) Tfc(key string, pluralCount interface{}, templateData interface{}) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID:    key,
		PluralCount:  pluralCount,
		TemplateData: templateData,
	})
}

func (l localizer) localizeWithFallback(key string, lc *i18n.LocalizeConfig) string {
	text, err := l.inner.Localize(lc)
	if err == nil {
		return text
	}

	slog.Warn(err.Error())

	if l.fallbackLocalizer != nil {
		return l.fallbackLocalizer.MustLocalize(lc)
	}

	return key
}

// Inner gives the backing i18n localizer instance
func (l localizer) Inner() *i18n.Localizer {
	return l.inner
}
