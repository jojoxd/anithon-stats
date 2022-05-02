import {AnilistUser} from "../AnilistUser";
import {SqliteDataSource} from "../../datasources/SqliteDataSource";
import {registerProvider} from "@tsed/di";

export const AnilistUserRepository = SqliteDataSource.getRepository(AnilistUser);

export const ANILIST_USER_REPOSITORY = Symbol.for("AnilistUserRepository");
export type ANILIST_USER_REPOSITORY = typeof AnilistUserRepository;

registerProvider<ANILIST_USER_REPOSITORY>({
    provide: ANILIST_USER_REPOSITORY,
    useValue: AnilistUserRepository,
});
