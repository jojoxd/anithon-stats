package controller

import (
	"encoding/json"
	"image/png"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"anistats/pkg/anistats_client"
)

type User struct {
	svc anistats_client.UserService
}

func NewUser(svc anistats_client.UserService) *User {
	return &User{svc: svc}
}

func (ctrl User) Register(root *mux.Router) {
	router := root.PathPrefix("/user").Subrouter()

	router.
		Methods("GET").
		Path("/").
		HandlerFunc(ctrl.listUsers)

	router.
		Methods("POST").
		Path("/").
		HandlerFunc(ctrl.searchUsers)

	router.
		Methods("GET").
		Path("/{userId}").
		HandlerFunc(ctrl.getUser)

	router.
		Methods("GET").
		Path("/{userId}/avatar").
		HandlerFunc(ctrl.getUserAvatar)
}

func (ctrl User) listUsers(w http.ResponseWriter, req *http.Request) {}

func (ctrl User) searchUsers(w http.ResponseWriter, req *http.Request) {}

func (ctrl User) getUser(w http.ResponseWriter, req *http.Request) {
	userId, err := uuid.Parse(mux.Vars(req)["userId"])
	if err != nil {
		panic(err)
	}

	user, err := ctrl.svc.User(req.Context(), userId)
	if err != nil {
		panic(err)
	}

	bytes, err := json.Marshal(user)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(bytes)
}

func (ctrl User) getUserAvatar(w http.ResponseWriter, req *http.Request) {
	userId, err := uuid.Parse(mux.Vars(req)["userId"])
	if err != nil {
		panic(err)
	}

	img, err := ctrl.svc.Avatar(req.Context(), userId)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "image/png")
	w.WriteHeader(200)

	if err := png.Encode(w, img); err != nil {
		panic(err)
	}
}
