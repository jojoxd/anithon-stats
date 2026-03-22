package transport

import (
	"log/slog"
	"net/http"

	"golang.org/x/time/rate"
)

type rateLimited struct {
	limiter *rate.Limiter
	logger  *slog.Logger
	http.RoundTripper
}

func NewRateLimited(
	base http.RoundTripper,
	limiter *rate.Limiter,
	logger *slog.Logger,
) http.RoundTripper {
	return &rateLimited{
		limiter:      limiter,
		logger:       logger,
		RoundTripper: base,
	}
}

func (t *rateLimited) RoundTrip(r *http.Request) (*http.Response, error) {
	// Ensure limited
	if err := t.limiter.Wait(r.Context()); err != nil {
		return nil, err
	}

	res, err := t.RoundTripper.RoundTrip(r)
	if err != nil {
		return res, err
	}

	limit := res.Header.Get("X-RateLimit-Limit")
	remaining := res.Header.Get("X-RateLimit-Remaining")
	reset := res.Header.Get("X-RateLimit-Reset")

	limitGroup := slog.Group("ratelimit",
		slog.Any("limit", limit),
		slog.Any("remaining", remaining),
		slog.Any("reset", reset),
	)

	limiterGroup := slog.Group("ratelimiter",
		slog.Any("limit", t.limiter.Limit()),
		slog.Any("remaining", t.limiter.Tokens()),
	)

	t.logger.Info("Ratelimit Info", limitGroup, limiterGroup)

	return res, err
}
