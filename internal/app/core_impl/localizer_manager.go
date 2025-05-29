package core_impl

import (
	"errors"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"

	"anistats/internal/app/core"
	"anistats/internal/app/res"
)

type localizerManager struct {
	localizer         *localizer
	bundles           res.LangBundles
	fallbackLocalizer *i18n.Localizer
}

func newLocalizerManager(bundles res.LangBundles, defaultLanguage language.Tag) (*localizerManager, error) {
	mgr := &localizerManager{
		bundles: bundles,
	}

	fallbackLocalizer, err := mgr.localizerForLanguage(res.LangEnglish, nil)
	if err != nil {
		return nil, err
	}
	mgr.fallbackLocalizer = fallbackLocalizer.Inner()

	err = mgr.setLocale(defaultLanguage)
	if err != nil {
		// todo wrap error, should be clear that "default" language is not available
		return nil, err
	}

	return mgr, nil
}

func (m *localizerManager) setLocale(lang language.Tag) error {
	l, err := m.localizerForLanguage(lang, m.fallbackLocalizer)
	if err != nil {
		return err
	}

	m.localizer = l
	return nil
}

func (m *localizerManager) localizerForLanguage(lang language.Tag, fallbackLocalizer *i18n.Localizer) (*localizer, error) {
	bundle, ok := m.bundles[lang]
	if !ok {
		return nil, errors.New(lang.String() + " has no available bundle")
	}

	return newLocalizer(lang, i18n.NewLocalizer(bundle), fallbackLocalizer), nil
}

func (m *localizerManager) Localizer() core.Localizer {
	return m.localizer
}
