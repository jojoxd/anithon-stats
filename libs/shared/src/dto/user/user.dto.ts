import {UserId} from "./user-ref";

export interface UserDto
{
    id: UserId;

    name: string;

    avatar: string;

    // @TODO: Stats, like total lists
}
