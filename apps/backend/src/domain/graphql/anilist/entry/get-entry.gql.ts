import { gql, DocumentNode } from "@apollo/client/core";

export {
	GetEntryQuery,
	GetEntryQueryVariables
} from '../generated-types';

export const GetEntry = gql`
	query GetEntry($entryId: Int!) {
		MediaList(id: $entryId) {
			id,
			status,
			progress,
			repeat,
		}
	}
` as DocumentNode;
