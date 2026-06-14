package anilist

import (
	"net/http"
	"time"

	"git.jojoxd.nl/projects/aslog"
	"golang.org/x/time/rate"

	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/transport"
)

type ClientOption func(httpClient *http.Client)

func WithToken(token string) ClientOption {
	return func(httpClient *http.Client) {
		httpClient.Transport = transport.NewAuthenticated(httpClient.Transport, token)
	}
}

var globalLimiter = rate.NewLimiter(rate.Every(time.Minute), 85)

func WithRateLimiter(logger *aslog.Logger) ClientOption {
	return func(httpClient *http.Client) {
		httpClient.Transport = transport.NewRateLimited(httpClient.Transport, globalLimiter, logger.Slog())
	}
}
