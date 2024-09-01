package activity

import (
	"github.com/google/uuid"
)

type ListActivityType string

const (
	ListCreated   ListActivityType = "created"
	ListCompleted ListActivityType = "completed"
)

// TODO unpublic
func NewList(common Common, activityType ListActivityType, listId uuid.UUID) List {
	return List{
		Common:       common,
		activityType: activityType,
		listId:       listId,
	}
}

type List struct {
	Common

	activityType ListActivityType
	listId       uuid.UUID
}

func (l List) ActivityType() ListActivityType {
	return l.activityType
}

func (l List) ListId() uuid.UUID {
	return l.listId
}
