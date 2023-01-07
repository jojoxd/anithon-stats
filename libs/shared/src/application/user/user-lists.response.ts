import {ListId, ListMetadataDto, UserDto} from "@anistats/shared";

export interface UserListsResponse
{
    user: UserDto;

    lists: Record<ListId, ListMetadataDto>;
}
