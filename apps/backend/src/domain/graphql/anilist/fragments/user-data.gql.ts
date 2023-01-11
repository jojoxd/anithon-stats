import { gql } from "@apollo/client/core";

export default gql`
	fragment userDataFragment on User {
		id,
		name,

		avatar {
			large,
			medium,
		},

		bannerImage
	}
`;
