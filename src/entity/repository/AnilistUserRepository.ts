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
        const user = await this.createQueryBuilder("au")
            .select()
            .leftJoinAndSelect("au.lists", "list")
            .leftJoinAndSelect("list.savedData", "saved_data")
            .where("au.userName = :userName", { userName })
            .getOneOrFail();

        // @HACK: TypeORM has no available option to create a backreference to
        //        user from user.lists.user, so we add it here instead.
        if(user) {
            for(const list of user.lists ?? []) {
                list.user ??= user;
            }
        }

        return user;
    }
});

export const ANILIST_USER_REPOSITORY = Symbol.for("AnilistUserRepository");
export type ANILIST_USER_REPOSITORY = typeof AnilistUserRepository;

registerProvider<ANILIST_USER_REPOSITORY>({
    provide: ANILIST_USER_REPOSITORY,
    useValue: AnilistUserRepository,
});
