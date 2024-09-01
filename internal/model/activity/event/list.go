package event

type List string

var (
	ListCreated   List = "created"
	ListCompleted List = "completed"
	ListDropped   List = "dropped"
)
