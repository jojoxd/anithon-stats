package activity

import (
	"time"

	"github.com/google/uuid"
)

type Activity interface {
	Id() uuid.UUID
	UserId() uuid.UUID
	CreatedAt() time.Time
}

func NewCommon(id uuid.UUID, userId uuid.UUID, createdAt time.Time) Common {
	return Common{
		id:        id,
		userId:    userId,
		createdAt: createdAt,
	}
}

type Common struct {
	id        uuid.UUID
	userId    uuid.UUID
	createdAt time.Time
}

func (a Common) Id() uuid.UUID {
	return a.id
}

func (a Common) UserId() uuid.UUID {
	return a.userId
}

func (a Common) CreatedAt() time.Time {
	return a.createdAt
}

type CreateActivity struct {
	UserId uuid.UUID
}

type CreateList struct {
	Common CreateActivity

	Type   ListActivityType
	ListId uuid.UUID
}

type CreateListEntry struct {
	Common CreateActivity

	Type        ListEntryActivityType
	ListEntryId uuid.UUID
}

type CreateUser struct {
	Common CreateActivity

	Type UserActivityType
}

type Message struct {
	Id         uuid.UUID
	ActivityId uuid.UUID
	AuthorId   uuid.UUID
	Message    string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type CreateMessage struct {
	ActivityId uuid.UUID
	AuthorId   uuid.UUID
	Message    string
}

type UpdateMessage struct {
	Message string
}
