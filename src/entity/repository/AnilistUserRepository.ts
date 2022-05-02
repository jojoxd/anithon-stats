import {AnilistUser} from "../AnilistUser";
import {SqliteDataSource} from "../../datasources/SqliteDataSource";
import {registerProvider} from "@tsed/di";

export const AnilistUserRepository = SqliteDataSource.getRepository(AnilistUser).extend({
    async updateOrCreate(user: AnilistUser): Promise<AnilistUser>
    {
        const current = await this.findOne({ where: { anilistUserId: user.anilistUserId } });

        if(!current) {
            return this.save(user);
        }

        current.userName = user.userName;

        return this.save(current);
    },

    async findUserByName(userName: string): Promise<AnilistUser | null>
    {
        return this.createQueryBuilder("au")
            .leftJoinAndSelect("au.lists", "list", "list.userId = au.id")
            .where("au.userName = :userName", { userName })
            .getOne();
    }
});

export const ANILIST_USER_REPOSITORY = Symbol.for("AnilistUserRepository");
export type ANILIST_USER_REPOSITORY = typeof AnilistUserRepository;

registerProvider<ANILIST_USER_REPOSITORY>({
    provide: ANILIST_USER_REPOSITORY,
    useValue: AnilistUserRepository,
});
