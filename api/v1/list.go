package v1

type ListId string

type List interface {
	GetId() ListId

	GetDisplayName() Translatable
}

type UpdateListRequest interface{}
