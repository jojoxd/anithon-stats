import { gql, DocumentNode } from "@apollo/client/core";

export {
	UpdateEntryMutation,
	UpdateEntryMutationVariables
} from '../../generated-types';

export const UpdateEntry = gql`
	mutation UpdateEntry($entryId: Int!, $status: MediaListStatus!, $progress: Int!, $repeats: Int!) {
		UpdateMediaListEntries(ids: [$entryId], status: $status, progress: $progress, repeat: $repeats) {
			id
		}
	}
` as DocumentNode;
