package controller

import (
	"encoding/json"
	_ "image/jpeg"
	"image/png"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"anistats/pkg/anistats_client"
)

type Media struct {
	svc anistats_client.MediaService
}

func NewMedia(svc anistats_client.MediaService) *Media {
	return &Media{svc: svc}
}

func (c Media) Register(root *mux.Router) {
	router := root.PathPrefix("/media").Subrouter()

	router.
		Methods("GET").
		Path("/").
		HandlerFunc(c.listMedia)

	router.
		Methods("GET").
		Path("/{mediaId}").
		HandlerFunc(c.getMedia)

	router.
		Methods("GET").
		Path("/{mediaId}/banner-image").
		HandlerFunc(c.getBannerImage)

	router.
		Methods("GET").
		Path("/{mediaId}/cover-image").
		HandlerFunc(c.getCoverImage)
}

func (c Media) listMedia(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(200)
	w.Write([]byte("List Media"))
}

func (c Media) getMedia(w http.ResponseWriter, req *http.Request) {
	mediaId, err := uuid.Parse(mux.Vars(req)["mediaId"])
	if err != nil {
		panic("Invalid UUID")
	}

	media, err := c.svc.Media(req.Context(), mediaId)
	if err != nil {
		panic(err)
	}

	bytes, err := json.Marshal(media)
	if err != nil {
		panic(err)
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(bytes)
}

func (c Media) getBannerImage(w http.ResponseWriter, req *http.Request) {
	mediaId, err := uuid.Parse(mux.Vars(req)["mediaId"])
	if err != nil {
		panic("Invalid UUID")
	}

	img, err := c.svc.BannerImage(req.Context(), mediaId)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "image/png")
	w.WriteHeader(200)

	if err := png.Encode(w, img); err != nil {
		panic(err)
	}
}

func (c Media) getCoverImage(w http.ResponseWriter, req *http.Request) {
	mediaId, err := uuid.Parse(mux.Vars(req)["mediaId"])
	if err != nil {
		panic("Invalid UUID")
	}

	img, err := c.svc.CoverImage(req.Context(), mediaId)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "image/png")
	w.WriteHeader(200)

	if err := png.Encode(w, img); err != nil {
		panic(err)
	}
}
