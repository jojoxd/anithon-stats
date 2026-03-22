package api

type SearchList struct {
	Users []*SearchListUser `json:"users"`
	Lists []*SearchListList `json:"lists"`
}

type SearchListUser struct {
	User `json:"-"`
}
type SearchListList struct {
	Id           string `json:"id"`
	ListMetadata `json:"-"`
}
