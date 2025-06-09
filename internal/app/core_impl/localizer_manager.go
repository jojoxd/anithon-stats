package core_impl

import (
	"errors"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"

	"anistats/internal/app/core"
	"anistats/internal/app/resources"
)

var _ core.LocalizerManager = (*localizerManager)(nil)

type localizerManager struct {
	localizer         core.Localizer
	bundles           res.LangBundles
	fallbackLocalizer *i18n.Localizer
}

func newLocalizerManager(bundles res.LangBundles, defaultLanguage language.Tag) (*localizerManager, error) {
	mgr := &localizerManager{
		bundles: bundles,
	}

	fallbackLocalizer, err := mgr.LocalizerForLanguage(res.LangEnglish)
	if err != nil {
		return nil, err
	}
	mgr.fallbackLocalizer = fallbackLocalizer.Inner()

	err = mgr.SetLocale(defaultLanguage)
	if err != nil {
		// todo wrap error, should be clear that "default" language is not available
		return nil, err
	}

	return mgr, nil
}

func (m *localizerManager) SetLocale(lang language.Tag) error {
	l, err := m.LocalizerForLanguage(lang)
	if err != nil {
		return err
	}

	m.localizer = l
	return nil
}

func (m *localizerManager) LocalizerForLanguage(lang language.Tag) (core.Localizer, error) {
	bundle, ok := m.bundles[lang]
	if !ok {
		return nil, errors.New(lang.String() + " has no available bundle")
	}

	return newLocalizer(lang, i18n.NewLocalizer(bundle), m.fallbackLocalizer), nil
}

func (m *localizerManager) Localizer() core.Localizer {
	return m.localizer
}

func (m *localizerManager) Languages() []language.Tag {
	return m.bundles.Languages()
}
