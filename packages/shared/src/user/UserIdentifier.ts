/**
 * User Identifier
 */
export type UserIdentifier = UserIdentifierUuid | UserIdentifierUserName | UserIdentifierAnilistUserId | UserIdentifierListUuid;

export enum UserIdentifierType
{
    Uuid = "uuid",
    UserName = "userName",
    AnilistUserId = "anilistUserId",
	ListUuid = "list-uuid",
}

export interface UserIdentifierUuid
{
    type: UserIdentifierType.Uuid;

    uuid: string;
}

export interface UserIdentifierUserName
{
    type: UserIdentifierType.UserName;

    userName: string;
}

export interface UserIdentifierAnilistUserId
{
    type: UserIdentifierType.AnilistUserId;

    anilistUserId: number;
}

export interface UserIdentifierListUuid
{
	type: UserIdentifierType.ListUuid;

	listUuid: string;
}

export function isUserIdentifierOfType<T extends UserIdentifierType>(ident: UserIdentifier, type: T): ident is UserIdentifier & { type: T }
{
    if(!isUserIdentifier(ident))
        return false;

    return ident?.type === type;
}

export function isUserIdentifier(ident: any): ident is UserIdentifier
{
    if(!ident || !ident.type)
        return false;

    return Object.values(UserIdentifierType).includes(ident?.type);
}
