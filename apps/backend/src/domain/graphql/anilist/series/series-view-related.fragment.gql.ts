import { DocumentNode, gql } from "@apollo/client/core";
import { SeriesViewFragment } from "./series-view.fragment.gql";
import { SeriesViewRelatedFragment as SeriesViewRelated } from "../generated-types";

export { SeriesViewRelated };

export const SeriesViewRelatedFragment = gql`
	fragment SeriesViewRelated on Media {
		...SeriesView

		relations {
			edges {
				relationType(version: 2),

				node {
					...SeriesView
				}
			}
		}
	}

	${SeriesViewFragment}
` as DocumentNode;
