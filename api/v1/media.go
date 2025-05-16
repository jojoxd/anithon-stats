package v1

type MediaId string

type Media interface {
	GetId() MediaId

	GetDisplayName() Translatable
}
