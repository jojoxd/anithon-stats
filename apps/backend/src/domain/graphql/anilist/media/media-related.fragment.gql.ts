import { DocumentNode, gql } from "@apollo/client/core";
import { MediaFragment } from "./media.fragment.gql";

export { MediaRelatedFragmentFragment as MediaRelatedFragmentData } from "../generated-types";

export const MediaRelatedFragment = gql`
	fragment MediaRelatedFragment on Media {
		...MediaFragment

		relations {
			edges {
				relationType(version: 2),

				node {
					...MediaFragment
				}
			}
		}
	}

	${MediaFragment}
` as DocumentNode;
