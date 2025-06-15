package res

import (
	"embed"
	"io/fs"

	"golang.org/x/text/language"

	gklocale "anistats/pkg/gio_kit/gklocalizer"
)

//go:embed localizations/**/*.yaml
var i18nFS embed.FS

var (
	LocaleEnglish        = gklocale.Locale(language.English)
	LocaleJapanese       = gklocale.Locale(language.Japanese)
	LocaleJapaneseRomaji = gklocale.Locale(language.MustParse("ja-Latn"))
	LocaleDutch          = gklocale.Locale(language.Dutch)
)

func Locales() []gklocale.Locale {
	return []gklocale.Locale{
		LocaleEnglish,
		LocaleJapanese,
		LocaleJapaneseRomaji,
		LocaleDutch,
	}
}

func LocaleBundle() (gklocale.GoI18nBundle, error) {
	loader := gklocale.NewGoI18nBundleLoader()

	sub, err := fs.Sub(i18nFS, "localizations")
	if err != nil {
		return nil, err
	}

	if err = loader.Load(sub, Locales()); err != nil {
		return nil, err
	}

	return loader.Bundle(), nil
}
