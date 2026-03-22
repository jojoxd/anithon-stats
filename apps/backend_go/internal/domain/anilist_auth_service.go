package domain

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/url"

	"git.jojoxd.nl/projects/anistats/backend/internal/config"
	"git.jojoxd.nl/projects/anistats/backend/pkg/aslog"
)

type AnilistAuthService struct {
	config config.Auth
	logger *aslog.Logger
}

func NewAnilistAuthService(config config.Auth, logger *aslog.Logger) *AnilistAuthService {
	return &AnilistAuthService{config, logger}
}

func (s AnilistAuthService) GetAuthorizeUrl(redirectUrl string) string {
	authorizeUrl, err := url.Parse("https://anilist.co/api/v2/oauth/authorize")
	if err != nil {
		panic(err)
	}

	q := authorizeUrl.Query()
	q.Set("client_id", s.config.Anilist.ClientId)
	q.Set("redirect_uri", redirectUrl)
	q.Set("response_type", "code")
	authorizeUrl.RawQuery = q.Encode()

	return authorizeUrl.String()
}

type anilistTokenExchangeRequest struct {
	GrantType    string `json:"grant_type"`
	ClientId     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	RedirectUri  string `json:"redirect_uri"`
	Code         string `json:"code"`
}

type anilistTokenExchangeResponse struct {
	AccessToken string `json:"access_token"`
}

func (s AnilistAuthService) ExchangeCode(ctx context.Context, code, redirectUri string) (string, error) {
	body, err := json.Marshal(&anilistTokenExchangeRequest{
		GrantType:    "authorization_code",
		ClientId:     s.config.Anilist.ClientId,
		ClientSecret: s.config.Anilist.ClientSecret,
		RedirectUri:  redirectUri,
		Code:         code,
	})

	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://anilist.co/api/v2/oauth/token", bytes.NewReader(body))
	if err != nil {
		return "", err
	}

	req.Header.Add("content-type", "application/json")
	req.Header.Add("accept", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()
	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	resp := anilistTokenExchangeResponse{}
	if err := json.Unmarshal(resBytes, &resp); err != nil {
		return "", err
	}

	if res.StatusCode != http.StatusOK {
		return "", errors.New(res.Status)
	}

	return resp.AccessToken, nil
}
