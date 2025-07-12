package controller

import "github.com/gorilla/mux"

type Controller interface {
	Register(root *mux.Router)
}
