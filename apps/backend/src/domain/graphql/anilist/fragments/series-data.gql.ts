import { gql } from "@apollo/client/core";

export default gql`
	fragment seriesDataFragment on Media {
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
`;
