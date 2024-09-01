package internal

type Discriminator string

const (
	ListActivityDiscriminator      Discriminator = "list"
	ListEntryActivityDiscriminator Discriminator = "list_entry"
	UserActivityDiscriminator      Discriminator = "user"
)
