package core_impl

import (
	"errors"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"

	"anistats/internal/app/res"
)

type localizerManager struct {
	localizer         *localizer
	bundles           res.LangBundles
	fallbackLocalizer *i18n.Localizer
}

func newLocalizerManager(bundles res.LangBundles) (*localizerManager, error) {
	mgr := &localizerManager{
		bundles: bundles,
	}

	fallbackLocalizer, err := mgr.localizerForLanguage(res.LangEnglish, nil)
	if err != nil {
		return nil, err
	}
	mgr.fallbackLocalizer = fallbackLocalizer.Inner()

	// Set default locale
	err = mgr.SetLocale(res.LangEnglish)
	if err != nil {
		return nil, err
	}

	return mgr, nil
}

func (m *localizerManager) SetLocale(lang language.Tag) error {
	localizer, err := m.localizerForLanguage(lang, m.fallbackLocalizer)
	if err == nil {
		m.localizer = localizer
		return nil
	}

	return err
}

func (m *localizerManager) localizerForLanguage(lang language.Tag, fallbackLocalizer *i18n.Localizer) (*localizer, error) {
	bundle, ok := m.bundles[lang]
	if !ok {
		return nil, errors.New(lang.String() + " is not a valid language")
	}

	return newLocalizer(lang, i18n.NewLocalizer(bundle), fallbackLocalizer), nil
}

func (m *localizerManager) Localizer() *localizer {
	return m.localizer
}
