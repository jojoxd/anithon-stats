package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Series holds the schema definition for the Series entity.
type Series struct {
	ent.Schema
}

// Fields of the Series.
func (Series) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),

		field.Uint("anilist_id").
			Unique(),

		field.String("title_english").
			Nillable(),
		field.String("title_native").
			Nillable(),
		field.String("title_romaji").
			Nillable(),

		field.String("description"),
		field.String("cover_image_url"),

		field.Uint("episodes"),

		field.Int64("duration").
			GoType(time.Duration(0)),
	}
}

// Edges of the Series.
func (Series) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("referenced_in", ListEntry.Type).
			Ref("series"),

		edge.From("custom_sequel_of", ListEntry.Type).
			Ref("custom_sequel_series"),

		edge.To("sequels", Series.Type).
			From("prequels"),
	}
}

func (Series) Mixin() []ent.Mixin {
	return []ent.Mixin{
		SynchronizedMixin{},
		TimeMixin{},
	}
}
