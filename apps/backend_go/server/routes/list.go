package routes

import (
	"net/http"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/application"
)

func HandleListGet(listService *application.ListService) http.Handler {
	type ListResponse struct {
		List api.List `json:"list"`
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		list, err := listService.GetList(r.Context(), r.PathValue("listId"))
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, &ListResponse{*list})
	})
}

func HandleListUpdate(listService *application.ListService) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		req, err := decode[api.UpdateListRequest](r)
		if err != nil {
			// todo log it
			badRequest(w, r)
			return
		}

		err = listService.UpdateList(r.Context(), req)
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, "updateList")
	})
}

func HandleListImagePng(listService *application.ListService) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := application.GenerateListImageParams{
			Embed:     true,
			WithStats: true,
		}

		_, err := listService.GenerateListImage(
			r.Context(),
			r.PathValue("listId"),
			params,
		)

		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		// todo: reply with image

		encode(w, r, http.StatusOK, "listImagePng")
	})
}

func HandleListImageSvg(listService *application.ListService) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := application.GenerateListImageParams{
			Embed:     true,
			WithStats: true,
		}

		_, err := listService.GenerateListImage(
			r.Context(),
			r.PathValue("listId"),
			params,
		)

		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		// todo: reply with image

		encode(w, r, http.StatusOK, "listImagePng")
	})
}

func HandleListEntryUpdate() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		encode(w, r, http.StatusOK, "listEntryUpdate")
	})
}
