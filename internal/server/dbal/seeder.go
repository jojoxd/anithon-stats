package dbal

import "context"

type Seeder interface {
	Seed(context context.Context, db Database) error
}
