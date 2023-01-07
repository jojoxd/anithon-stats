import { gql } from "@apollo/client";

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
