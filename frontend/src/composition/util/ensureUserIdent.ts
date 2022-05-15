import {computed} from "vue";
import {IUserData, UserIdentifier, UserIdentifierType} from "@anistats/shared";
import {get, MaybeRef} from "@vueuse/core";

export type MaybeUserIdentifierRef = MaybeRef<UserIdentifier | IUserData | string | null>;
export type MaybeUserIdentifierTypeRef = MaybeRef<UserIdentifierType>;

export function ensureUserIdent(ident: MaybeUserIdentifierRef, type?: MaybeUserIdentifierTypeRef)
{
	return computed<UserIdentifier>(() => {
		const _type = get(type);
		const _ident = get(ident);

		if((_ident as IUserData)?.uuid) {
			return {
				type: UserIdentifierType.Uuid,
				uuid: (_ident as IUserData).uuid,
			};
		}

		if(!!_type) {
			let prop: any;
			switch(type) {
				case UserIdentifierType.Uuid:
					prop = "uuid";
					break;

				case UserIdentifierType.AnilistUserId:
					prop = "anilistUserId";
					break;

				case UserIdentifierType.ListUuid:
					prop = "listUuid";
					break;

				case UserIdentifierType.UserName:
					prop = "userName";
					break;

				default:
					throw new Error("Error: Exhausted UserIdentifierType switch");
			}

			return {
				type: _type,
				[prop]: _ident,
			} as unknown as UserIdentifier;
		}

		return _ident as UserIdentifier;
	});
}
