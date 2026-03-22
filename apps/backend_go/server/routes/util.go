package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"git.jojoxd.nl/projects/anistats/backend/api"
)

func encode[T any](w http.ResponseWriter, r *http.Request, status int, v T) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(v); err != nil {
		panic(err)
	}
}

func encodeError(w http.ResponseWriter, r *http.Request, status int, message string) {
	encode(w, r, status, &api.Error{
		Code:    status,
		Message: message,
	})
}

func decode[T any](r *http.Request) (T, error) {
	var v T

	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return v, fmt.Errorf("failed to json decode: %w", err)
	}

	return v, nil
}

func badRequest(w http.ResponseWriter, r *http.Request) {
	encode(w, r, http.StatusBadRequest, &api.Error{
		Code:    http.StatusBadRequest,
		Message: "bad request",
	})
}

func internalServerError(w http.ResponseWriter, r *http.Request) {
	encode(w, r, http.StatusInternalServerError, &api.Error{
		Code:    http.StatusInternalServerError,
		Message: "internal server error",
	})
}

func redirect(w http.ResponseWriter, statusCode int, location string) {
	w.Header().Set("location", location)
	w.WriteHeader(statusCode)
}
