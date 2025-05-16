package core_impl

import (
	"errors"
	"log/slog"
	"slices"

	"golang.org/x/text/language"

	v1 "anistats/api/v1"
	"anistats/internal/app/core"
	"anistats/internal/app/res"
)

var _ core.MediaLocalizer = (*mediaLocalizer)(nil)

var mediaLocalizerFallback = []language.Tag{
	res.LangJapanese,
	res.LangJapaneseHepburn,
	res.LangEnglish,
}

type mediaLocalizer struct {
	currentLocale language.Tag
	logger        slog.Logger
}

func newMediaLocalizer(initialLanguage language.Tag, logger *slog.Logger) *mediaLocalizer {
	return &mediaLocalizer{
		currentLocale: initialLanguage,
		logger:        *logger,
	}
}

func (a *mediaLocalizer) SetLocale(locale language.Tag) error {
	exists := slices.Contains(res.AppLanguages, locale)
	if !exists {
		return errors.New("locale not found")
	}

	a.currentLocale = locale
	return nil
}

func (a *mediaLocalizer) T(t v1.Translatable) string {
	return t.ForLanguage(a.currentLocale)
}
