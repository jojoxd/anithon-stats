import { gql, DocumentNode } from "@apollo/client/core";
import {UserViewFragment} from "./user-view.fragment.gql";
import {PageViewFragment} from "../page/page-view.fragment.gql";

export { SearchUsersQuery, SearchUsersQueryVariables } from "../generated-types";

export const SearchUsers = gql`
	query searchUsers($query: String!, $page: Int!, $perPage: Int!) {
		Page(page: $page, perPage: $perPage) {
			...PageView,

			users(search: $query) {
				...UserView
			}
		}
	}

	${PageViewFragment}
	${UserViewFragment}
` as DocumentNode;
