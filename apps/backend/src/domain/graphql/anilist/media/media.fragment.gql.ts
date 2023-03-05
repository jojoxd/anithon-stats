import { DocumentNode, gql } from "@apollo/client/core";

export { MediaFragmentFragment as MediaFragmentData } from "../generated-types";

export const MediaFragment = gql`
	fragment MediaFragment on Media {
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
