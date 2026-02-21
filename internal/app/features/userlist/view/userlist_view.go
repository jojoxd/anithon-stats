package view

import (
	"gioui.org/layout"
	"git.jojoxd.nl/projects/go-giorno/router/intent"
	"git.jojoxd.nl/projects/go-giorno/router/view"
	"github.com/google/uuid"
)

type UserListView struct {
	view.TypedView[uuid.UUID]
}

func NewUserListView() UserListView {

}

func (v UserListView) OnIntent(intent intent.Base) {}

func (v UserListView) Layout(gtx layout.Context) layout.Dimensions {
	return layout.Dimensions{}
}

func (v UserListView) OnParameter(userListId uuid.UUID) {}
