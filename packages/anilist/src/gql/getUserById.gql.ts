import {DocumentNode} from "graphql";
import userFragment from "./fragments/UserDataFragment.gql";
import gql from "graphql-tag";

export default gql`
    query getUserById($userId: Int!) {
        User(id: $userId) {
			...UserData
        }
    }
	
	${userFragment}
` as unknown as DocumentNode;
