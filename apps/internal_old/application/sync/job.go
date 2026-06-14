package sync

type Job interface {
	ImplementsSyncItem()
}
