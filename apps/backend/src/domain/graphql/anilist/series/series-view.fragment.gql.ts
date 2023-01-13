import {DocumentNode, gql} from "@apollo/client/core";

export const SeriesViewFragment = gql`
	fragment SeriesView on Media {
		id,

		title {
			english,
			native,
			romaji,
		},

		description,

		coverImage {
			extraLarge,
		},

		duration,

		episodes,

		relations {
			edges {
				relationType(version: 2),

				node {
					id,
				}
			}
		}
	}
` as DocumentNode;
