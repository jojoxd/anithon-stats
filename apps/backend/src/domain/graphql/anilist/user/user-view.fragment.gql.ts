import { gql, DocumentNode } from "@apollo/client/core";

export const UserViewFragment = gql`
	fragment UserView on User {
		id,
		name,
	
		avatar {
			large,
			medium,
		},
	
		bannerImage
	}
` as DocumentNode;
