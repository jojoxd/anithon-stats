package routes

import (
	"net/http"

	"git.jojoxd.nl/projects/anistats/backend/api"
	"git.jojoxd.nl/projects/anistats/backend/internal/application"
)

func HandleSearchAnime(searchService *application.SearchService) http.HandlerFunc {
	type SearchRequest struct {
		Query string `json:"query"`
	}

	type SearchResponse struct {
		Series []api.Series `json:"series"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		req, err := decode[SearchRequest](r)
		if err != nil {
			// todo log it
			badRequest(w, r)
			return
		}

		res, err := searchService.SearchSeries(r.Context(), req.Query)
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, &SearchResponse{Series: res.Items})
	}
}

func HandleSearchGlobal(searchService *application.SearchService) http.HandlerFunc {
	type SearchRequest struct {
		Query string `json:"query"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		req, err := decode[SearchRequest](r)
		if err != nil {
			// todo log it
			badRequest(w, r)
			return
		}

		res, err := searchService.SearchGlobal(r.Context(), req.Query)
		if err != nil {
			// todo log it
			internalServerError(w, r)
			return
		}

		encode(w, r, http.StatusOK, res)
	}
}
