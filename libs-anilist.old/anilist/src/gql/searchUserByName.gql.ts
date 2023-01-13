import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";
import userFragment from "./fragments/UserDataFragment.gql";

export default gql`
    query searchUserByName($name: String!) {
        User(name: $name) {
			...UserData
        }
    }

	${userFragment}
` as unknown as DocumentNode;
