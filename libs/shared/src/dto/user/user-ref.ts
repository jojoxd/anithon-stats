declare const UserIdSymbol: unique symbol;

export type UserId = string & { [UserIdSymbol]: never };

export interface UserRef
{
    ref: UserId;
}