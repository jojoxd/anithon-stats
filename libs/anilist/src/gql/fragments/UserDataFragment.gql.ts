import gql from "graphql-tag";
import {DocumentNode} from "graphql";

export default gql`
	fragment UserData on User {
		id,
		name,
		
		avatar {
			large,
			medium,
		},
		
		bannerImage
	}
` as unknown as DocumentNode;
