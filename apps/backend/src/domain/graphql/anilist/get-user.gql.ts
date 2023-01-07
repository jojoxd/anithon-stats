import { gql } from "@apollo/client";
import userDataFragment from "./fragments/user-data.gql";


export default gql`
	query getUser($userId: Int!) {
		User(id: $userId) {
			...userDataFragment
		}
	}

	${userDataFragment}
`;
