package event

type ListEntry string

var (
	ListEntryCreated   ListEntry = "created"
	ListEntryUpdated   ListEntry = "updated"
	ListEntryCompleted ListEntry = "completed"
)
