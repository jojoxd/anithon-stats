import { DocumentNode, gql } from "@apollo/client/core";

export const PageViewFragment = gql`
	fragment PageView on Page {
		pageInfo {
			currentPage,
			hasNextPage,
		}
	}
` as DocumentNode;