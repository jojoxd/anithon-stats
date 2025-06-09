package anistats_client_http

import (
	"net/http"
	"net/url"
)

type HttpClient struct {
	client http.Client
	config HttpClientConfig
}

type HttpClientConfig struct {
	BaseUrl *url.URL
}

func NewHttpClient(client http.Client, config HttpClientConfig) *HttpClient {
	return &HttpClient{
		config: config,
		client: client,
	}
}
