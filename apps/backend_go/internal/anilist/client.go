package anilist

import (
	"context"
	"net/http"
	"strconv"

	"github.com/Khan/genqlient/graphql"

	"git.jojoxd.nl/projects/anistats/backend/internal/anilist/generated"
)

type Client struct {
	inner graphql.Client
}

func NewClient(opts ...ClientOption) *Client {
	httpClient := &http.Client{
		Transport: http.DefaultTransport,
	}

	for _, opt := range opts {
		opt(httpClient)
	}

	inner := graphql.NewClient("https://graphql.anilist.co", httpClient)

	return &Client{inner}
}

func (c Client) GetCurrentUser(ctx context.Context) (generated.UserFragment, error) {
	res, err := generated.GetCurrentUser(ctx, c.inner)
	if err != nil {
		return generated.UserFragment{}, err
	}

	return res.GetViewer(), nil
}

func (c Client) GetUser(ctx context.Context, id string) (generated.UserFragment, error) {
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return generated.UserFragment{}, err
	}

	res, err := generated.GetUser(ctx, c.inner, idInt)
	if err != nil {
		return generated.UserFragment{}, err
	}

	return res.GetUser(), err
}

func (c Client) GetUserLists(ctx context.Context, id string, mediaType generated.MediaType) (*generated.GetUserListsResponse, error) {
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return nil, err
	}

	return generated.GetUserLists(ctx, c.inner, idInt, mediaType)
}

func (c Client) GetSeries(ctx context.Context, id string) (generated.MediaFragment, error) {
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return generated.MediaFragment{}, err
	}

	res, err := generated.GetSeries(ctx, c.inner, idInt)
	if err != nil {
		return generated.MediaFragment{}, err
	}

	return res.Media.MediaFragment, nil
}
