package server

import (
	"context"
	"log/slog"

	"github.com/jaswdr/faker/v2"

	"anistats/internal/server/dbal/sqlite"
	"anistats/internal/server/seeders"
)

type Server struct{}

func New() *Server {
	return &Server{}
}

func (s *Server) Serve(ctx context.Context) error {
	db, err := sqlite.New(sqlite.Config{Path: "./test.db"}, slog.Default())
	if err != nil {
		return err
	}

	err = db.Migrate(ctx)
	if err != nil {
		return err
	}

	testSeeder := seeders.TestSeeder{}
	if err := testSeeder.Seed(ctx, faker.New(), db); err != nil {
		return err
	}

	// mr, err := db.MediaRepository(ctx)
	// if err != nil {
	// 	return err
	// }
	//
	// req := dbal.CreateMediaRequest{
	// 	DisplayName: dbal.CreateTranslationRequest{
	// 		Translations: map[language.Tag]string{
	// 			language.English:              "english",
	// 			language.MustParse("ja-Latn"): "romaji",
	// 			language.Japanese:             "japanese",
	// 		},
	// 	},
	// 	Description:      "description",
	// 	EpisodesTotal:    13,
	// 	EpisodesDuration: time.Duration(24) * time.Minute,
	// }
	//
	// media, err := mr.CreateMedia(ctx, req)
	// if err != nil {
	// 	return err
	// }
	//
	// fmt.Printf("%#v\n", media)

	return nil
}
