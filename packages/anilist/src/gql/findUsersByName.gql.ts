import gql from "graphql-tag";
import {DocumentNode} from "graphql";
import userFragment from "./fragments/UserDataFragment.gql";

export default gql`
	query findUsersByName($query: String!, $page: Int!, $perPage: Int!) {
		Page(page: $page, perPage: $perPage) {
			users(search: $query) {
				...UserData
			}
		}
	}
	
	${userFragment}
` as unknown as DocumentNode;
