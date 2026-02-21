package tests

import (
	"context"
	"log/slog"
	"testing"

	"anistats/internal/server/dbal"
	"anistats/internal/server/dbal/sqlite"
)

func getdb() dbal.Database {
	config := sqlite.Config{
		Path: "test.sqlite",
	}

	db, err := sqlite.New(config, slog.Default())
	if err != nil {
		panic(err)
	}

	if err = db.Migrate(context.Background()); err != nil {
		panic(err)
	}

	return db
}

func TestPersists(t *testing.T) {
	db := getdb()

	t.Run("Persists", func(t *testing.T) {
		ur, err := db.UserRepository(t.Context())
		if err != nil {
			t.Fatal(err)
		}

		user, err := ur.CreateUser(t.Context(), dbal.CreateUserRequest{
			Name: "test",
		})

		if err != nil {
			t.Fatal(err)
		}

		user, err = ur.GetUser(t.Context(), user.Id)
		if err != nil {
			t.Fatal(err)
		}
	})
}
