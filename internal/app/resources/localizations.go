package res

import (
	"embed"
	"io/fs"

	"git.jojoxd.nl/projects/go-giorno/localizer/locale"
	giornoI18n "git.jojoxd.nl/projects/go-giorno/pkg/giorno-i18n"
	"golang.org/x/text/language"
)

//go:embed localizations/**/*.yaml
var i18nFS embed.FS

//go:generate ./gen_icons.sh

var (
	LocaleEnglish        = locale.Locale(language.English)
	LocaleJapanese       = locale.Locale(language.Japanese)
	LocaleJapaneseRomaji = locale.Locale(language.MustParse("ja-Latn"))
	LocaleDutch          = locale.Locale(language.Dutch)
)

func Locales() []locale.Locale {
	return []locale.Locale{
		LocaleEnglish,
		LocaleJapanese,
		LocaleJapaneseRomaji,
		LocaleDutch,
	}
}

func LocaleBundle() (giornoI18n.Bundle, error) {
	loader := giornoI18n.NewLoader()

	sub, err := fs.Sub(i18nFS, "localizations")
	if err != nil {
		return nil, err
	}

	if err = loader.Load(sub, Locales()); err != nil {
		return nil, err
	}

	return loader.Bundle(), nil
}
