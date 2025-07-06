package seeders

import (
	"context"
	"fmt"

	"github.com/jaswdr/faker/v2"

	"anistats/internal/server/dbal"
)

type TestSeeder struct{}

func (t TestSeeder) Seed(ctx context.Context, fake faker.Faker, db dbal.Database) error {
	ur, err := db.UserRepository(ctx)
	if err != nil {
		return err
	}

	user, err := ur.CreateUser(ctx, dbal.CreateUserRequest{
		Name: fake.Internet().User(),
	})
	if err != nil {
		return err
	}

	fmt.Printf("user: %#v\n", user)

	return nil
}
