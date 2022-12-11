/**
 * User Identifier
 */
export declare type UserIdentifier = UserIdentifierUuid | UserIdentifierUserName | UserIdentifierAnilistUserId | UserIdentifierListUuid;
export declare enum UserIdentifierType {
    Uuid = "uuid",
    UserName = "userName",
    AnilistUserId = "anilistUserId",
    ListUuid = "list-uuid"
}
export interface UserIdentifierUuid {
    type: UserIdentifierType.Uuid;
    uuid: string;
}
export interface UserIdentifierUserName {
    type: UserIdentifierType.UserName;
    userName: string;
}
export interface UserIdentifierAnilistUserId {
    type: UserIdentifierType.AnilistUserId;
    anilistUserId: number;
}
export interface UserIdentifierListUuid {
    type: UserIdentifierType.ListUuid;
    listUuid: string;
}
export declare function isUserIdentifierOfType<T extends UserIdentifierType>(ident: UserIdentifier, type: T): ident is UserIdentifier & {
    type: T;
};
export declare function isUserIdentifier(ident: any): ident is UserIdentifier;
//# sourceMappingURL=UserIdentifier.d.ts.map