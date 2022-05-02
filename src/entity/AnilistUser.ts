import {Column, Entity, Generated, ManyToOne, PrimaryColumn, Unique} from "typeorm";
import {Property} from "@tsed/schema";
import {UserList} from "./UserList";

@Entity()
@Unique("UQ_USER_ANILIST_USERNAME", ["userName"])
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
    public anilistUserId!: string;

    @ManyToOne(() => UserList, (list) => list.user)
    public lists: Array<UserList> = [];
}
