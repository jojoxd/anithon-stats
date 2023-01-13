import { gql, DocumentNode } from "@apollo/client/core";
import { UserViewFragment } from "./user-view.fragment.gql";

export { GetCurrentUserQuery, GetCurrentUserQueryVariables } from "../generated-types";

export const GetCurrentUser = gql`
	query getCurrentUser {
		Viewer {
			...UserView
		}
	}

	${UserViewFragment}
` as DocumentNode;
