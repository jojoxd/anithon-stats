package api

type Error struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type ValidationError struct {
	Error  `json:"-"`
	Issues map[string]string
}
