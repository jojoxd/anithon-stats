package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"

	"git.jojoxd.nl/projects/anistats/backend/api"
)

// ListEntry holds the schema definition for the ListEntry entity.
type ListEntry struct {
	ent.Schema
}

// Fields of the ListEntry.
func (ListEntry) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),

		field.Uint("anilist_id"),

		field.Enum("state").
			GoType(api.EntryStatus("completed")),
		field.Uint("progress").
			Default(0),

		// data, state, progress
		field.Float("multiplier").
			Default(1.0),

		field.Uint("order").
			Nillable().
			Optional(),

		field.Uint("start_at").
			Nillable().
			Optional(),

		field.Uint("split").
			Nillable().
			Optional(),

		field.Bool("split_sequel_entry").
			Default(false),
	}
}

// Edges of the ListEntry.
func (ListEntry) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("list", List.Type).
			Ref("entries").
			Unique(),

		edge.To("series", Series.Type).
			Unique(),
		edge.To("custom_sequel_series", Series.Type).
			Unique(),
	}
}

func (ListEntry) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}
