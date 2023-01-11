import { gql, DocumentNode } from "@apollo/client/core";
import userDataFragment from "./fragments/user-data.gql";

export { GetCurrentUserQuery, GetCurrentUserQueryVariables } from "./generated-types";

export const GetCurrentUser = gql`
	query getCurrentUser {
		Viewer {
			...userDataFragment
		}
	}
	
	${userDataFragment}
` as DocumentNode;
