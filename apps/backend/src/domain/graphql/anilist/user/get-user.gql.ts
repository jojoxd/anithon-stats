import { gql, DocumentNode } from "@apollo/client/core";
import { UserViewFragment } from "./user-view.fragment.gql";

export { GetUserQuery, GetUserQueryVariables } from "../generated-types";

export const GetUser = gql`
	query getUser($userId: Int!) {
		User(id: $userId) {
			...UserView
		}
	}

	${UserViewFragment}
` as DocumentNode;
