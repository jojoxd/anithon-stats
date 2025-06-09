package core_impl

import (
	"log/slog"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
)

var _ core.Localizer = (*localizer)(nil)

type localizer struct {
	language          language.Tag
	inner             *i18n.Localizer
	fallbackLocalizer *i18n.Localizer
}

func newLocalizer(language language.Tag, inner *i18n.Localizer, fallbackLocalizer *i18n.Localizer) core.Localizer {
	return &localizer{
		language:          language,
		inner:             inner,
		fallbackLocalizer: fallbackLocalizer,
	}
}

func (l localizer) T(key string) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID: key,
	})
}

func (l localizer) Tf(key string, templateData interface{}) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID:    key,
		TemplateData: templateData,
	})
}

func (l localizer) Tc(key string, pluralCount interface{}) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID:   key,
		PluralCount: pluralCount,
	})
}

func (l localizer) Tfc(key string, pluralCount interface{}, templateData interface{}) string {
	return l.localizeWithFallback(key, &i18n.LocalizeConfig{
		MessageID:    key,
		PluralCount:  pluralCount,
		TemplateData: templateData,
	})
}

func (l localizer) TTv1(translatable v1.Translatable) string {
	if message, ok := translatable.Translations[l.language]; ok {
		return message
	}

	return "todo: fallback locale in TTv1"
}

func (l localizer) Inner() *i18n.Localizer {
	return l.inner
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

func (l localizer) PageTitle(key string, templateData interface{}) string {
	return l.Tf("core.title", map[string]string{
		"AppName": l.T("core.appName"),
		"Title":   l.Tf(key, templateData),
	})
}
