package controller

import (
	"net/http"

	"github.com/gorilla/mux"

	"anistats/pkg/anistats_client"
)

type UserList struct {
	svc anistats_client.UserListService
}

func NewUserList(svc anistats_client.UserListService) *UserList {
	return &UserList{svc: svc}
}

func (ctrl UserList) Register(root *mux.Router) {
	router := root.PathPrefix("/list").Subrouter()

	// Create List
	router.
		Methods("POST").
		Path("/").
		HandlerFunc(ctrl.createUserList)

	// Read List
	router.
		Methods("GET").
		Path("/").
		HandlerFunc(ctrl.listUserLists)

	router.
		Methods("GET").
		Path("/{listId}").
		HandlerFunc(ctrl.getUserList)

	// Update List
	router.
		Methods("PUT").
		Path("/{listId}").
		HandlerFunc(ctrl.updateUserList)

	// Delete List
	router.
		Methods("DELETE").
		Path("/{listId}").
		HandlerFunc(ctrl.deleteUserList)

	// Create List Entry
	router.
		Methods("PUT").
		Path("/{listId}/entries/{entryId}").
		HandlerFunc(ctrl.updateUserListEntry)

	// Read List Entry
	router.
		Methods("GET").
		Path("/{listId}/entries").
		HandlerFunc(ctrl.getUserListEntries)

	router.
		Methods("GET").
		Path("/{listId}/entries/{entryId}").
		HandlerFunc(ctrl.getUserListEntry)

	// Update List Entry
	router.
		Methods("POST").
		Path("/{listId}/entries").
		HandlerFunc(ctrl.createUserListEntry)

	// Delete List Entry
	router.
		Methods("DELETE").
		Path("/{listId}/entries/{entryId}").
		HandlerFunc(ctrl.deleteUserListEntry)
}

func (ctrl UserList) createUserList(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) listUserLists(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) getUserList(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) updateUserList(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) deleteUserList(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) createUserListEntry(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) getUserListEntries(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) getUserListEntry(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) updateUserListEntry(w http.ResponseWriter, req *http.Request) {

}

func (ctrl UserList) deleteUserListEntry(w http.ResponseWriter, req *http.Request) {

}
