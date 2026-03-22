package dev

import "git.jojoxd.nl/projects/anistats/backend/api"

var kMedalistSeason2Episodes int64 = 1
var kMedalistSeason2Description string = "The second season of Medalist.\n\n"

var Series_MedalistSeason2 = api.Series{
	Id: "1",
	Title: api.SeriesTitle{
		Romaji:  "Medalist 2nd Season",
		English: "Medalist Season 2",
		Native:  "メダリスト 第2期",
	},
	CoverImage:  "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx189275-eHsK0lNnFfXH.jpg",
	Duration:    10,
	Episodes:    &kMedalistSeason2Episodes,
	Description: &kMedalistSeason2Description,
	PrequelIds:  nil,
	SequelIds:   nil,
}
