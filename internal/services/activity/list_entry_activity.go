package activity

import (
	"github.com/google/uuid"
)

type ListEntryActivityType string

const (
	ListEntryCreated ListEntryActivityType = "created"
	ListEntryWatched ListEntryActivityType = "watched"
	ListEntryDropped ListEntryActivityType = "dropped"
)

func NewListEntry(common Common, activityType ListEntryActivityType, listEntryId uuid.UUID) ListEntry {
	return ListEntry{
		Common:       common,
		activityType: activityType,
		listEntryId:  listEntryId,
	}
}

type ListEntry struct {
	Common

	activityType ListEntryActivityType
	listEntryId  uuid.UUID
}

func (le ListEntry) ActivityType() ListEntryActivityType {
	return le.activityType
}

func (le ListEntry) ListEntryId() uuid.UUID {
	return le.listEntryId
}
