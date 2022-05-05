import {Column, Entity, Generated, OneToMany, PrimaryColumn, Unique} from "typeorm";
import {Property} from "@tsed/schema";
import {UserList} from "./UserList";

@Entity()
@Unique("UQ_USER_ANILIST_UID", ["anilistUserId"])
export class AnilistUser
{
    @PrimaryColumn()
    @Generated("uuid")
    @Property()
    public id!: string;

    @Property()
    @Column()
    public userName!: string;

    @Property()
    @Column({ nullable: false })
    public anilistUserId!: number;

    @Property()
    @Column()
    public lastUpdated!: Date;

    @OneToMany(() => UserList, (list) => list.user, { cascade: true })
    public lists?: Array<UserList>;
}
