import { gql, DocumentNode } from "@apollo/client/core";
import userDataFragment from "./fragments/user-data.gql";

export { GetUserQuery, GetUserQueryVariables } from "./generated-types";

export const GetUser = gql`
	query getUser($userId: Int!) {
		User(id: $userId) {
			...userDataFragment
		}
	}

	${userDataFragment}
` as DocumentNode;
