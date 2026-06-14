package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// List holds the schema definition for the List entity.
type List struct {
	ent.Schema
}

// Fields of the List.
func (List) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),

		field.String("name"),
		field.String("description"),

		field.Uint("stack_size").
			Default(4),
		field.Bool("allow_chunk_merge").
			Default(true),
		field.Uint("max_chunk_length").
			Default(30 * 4),
		field.Uint("max_chunk_join_length").
			Default(30 * 6),
	}
}

// Edges of the List.
func (List) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).
			Ref("lists").
			Unique(),

		edge.To("entries", ListEntry.Type),
	}
}

func (List) Mixin() []ent.Mixin {
	return []ent.Mixin{
		SynchronizedMixin{},
		TimeMixin{},
	}
}
