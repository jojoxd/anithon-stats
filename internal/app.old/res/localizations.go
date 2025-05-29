package res

import (
	"embed"
	"fmt"
	"io/fs"
	"log/slog"
	"strings"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
	"gopkg.in/yaml.v3"
)

//go:embed localizations/**/*.yaml
var i18nFS embed.FS

var (
	LangEnglish         = language.English
	LangDutch           = language.Dutch
	LangJapanese        = language.Japanese
	LangJapaneseHepburn = language.MustParse("ja-latn")
)

var AppLanguages = []language.Tag{
	LangEnglish,
	LangDutch,
	LangJapanese,
	LangJapaneseHepburn,
}

type LangBundles map[language.Tag]*i18n.Bundle

func GetLangBundles() (LangBundles, error) {
	var bundles = make(LangBundles)

	for _, lang := range AppLanguages {
		bundle, err := loadBundle(lang)
		if err != nil {
			return nil, err
		}

		bundles[lang] = bundle
	}

	return bundles, nil
}

func loadBundle(lang language.Tag) (*i18n.Bundle, error) {
	glob := fmt.Sprintf("localizations/**/*.%s.yaml", strings.ToLower(lang.String()))

	bundle := i18n.NewBundle(lang)
	bundle.RegisterUnmarshalFunc("yaml", yaml.Unmarshal)

	matches, err := fs.Glob(i18nFS, glob)
	if err != nil {
		return nil, err
	}

	for _, match := range matches {
		_, err := bundle.LoadMessageFileFS(i18nFS, match)
		if err != nil {
			return nil, err
		}
	}

	return bundle, nil
}

func init() {
	slog.SetLogLoggerLevel(slog.LevelDebug)
}
