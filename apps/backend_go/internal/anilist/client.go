package anilist

import (
	"context"
	"net/http"

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

func (c Client) GetUser(ctx context.Context, id uint) (generated.UserFragment, error) {
	res, err := generated.GetUser(ctx, c.inner, int(id))
	if err != nil {
		return generated.UserFragment{}, err
	}

	return res.GetUser(), err
}

func (c Client) GetUserByName(ctx context.Context, name string) (generated.UserFragment, error) {
	res, err := generated.GetUserByName(ctx, c.inner, name)
	if err != nil {
		return generated.UserFragment{}, err
	}

	return res.GetUser(), err
}

func (c Client) GetUserLists(ctx context.Context, id uint, mediaType generated.MediaType) (*generated.GetUserListsResponse, error) {
	return generated.GetUserLists(ctx, c.inner, int(id), mediaType)
}

func (c Client) GetSeries(ctx context.Context, id uint) (generated.MediaFragment, error) {
	res, err := generated.GetSeries(ctx, c.inner, int(id))
	if err != nil {
		return generated.MediaFragment{}, err
	}

	return res.Media.MediaFragment, nil
}

func (c Client) SearchSeries(ctx context.Context, query string, mediaType generated.MediaType, page uint) ([]generated.MediaRelatedFragment, generated.PageViewPageInfo, error) {
	res, err := generated.SearchSeries(ctx, c.inner, query, mediaType, int(page), 50)
	if err != nil {
		return nil, generated.PageViewPageInfo{}, err
	}

	var mediaRelatedFragments = make([]generated.MediaRelatedFragment, len(res.Page.Media))
	for i, mediaRelatedFragment := range res.Page.Media {
		mediaRelatedFragments[i] = mediaRelatedFragment.MediaRelatedFragment
	}

	return mediaRelatedFragments, res.Page.PageInfo, err
}
