package transport

import "net/http"

type authenticated struct {
	token string
	http.RoundTripper
}

func NewAuthenticated(base http.RoundTripper, token string) http.RoundTripper {
	return &authenticated{
		token:        token,
		RoundTripper: base,
	}
}

func (t *authenticated) RoundTrip(r *http.Request) (*http.Response, error) {
	r.Header.Set("Authorization", "Bearer "+t.token)

	return t.RoundTripper.RoundTrip(r)
}
