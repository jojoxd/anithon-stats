import {DocumentNode, gql} from "@apollo/client/core";
import {SeriesViewFragment as SeriesView} from "../generated-types";

export { SeriesView };

export const SeriesViewFragment = gql`
	fragment SeriesView on Media {
		id,

		type,

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

		episodes
	}
` as DocumentNode;

export function isSeriesView(value: unknown): value is SeriesView
{
	return typeof value === 'object'
		&& value !== null
		&& '__typename' in value
		&& (value as any).__typename === 'Media'
		&& 'description' in value;
}