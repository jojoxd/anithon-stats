import {Column, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryColumn, Unique} from "typeorm";
import {Property} from "@tsed/schema";
import {SavedData} from "./SavedData";
import {AnilistUser} from "./AnilistUser";

@Entity()
@Unique("UQ_USERLISTS", ["userName", "listName"])
export class UserList
{
    constructor()
    {
        this.savedData = new SavedData();
    }

    @PrimaryColumn()
    @Generated("increment")
    @Property()
    public id!: number;

    @Property()
    @OneToMany(() => AnilistUser, (user) => user.lists)
    public user!: AnilistUser;

    // @TODO: Change this to AnilistUser
    // Identifying info
    @Property()
    @Column()
    public userName!: string;

    @Property()
    @Column()
    public listName!: string;

    // Settings
    @Column({ default: true })
    public allowChunkMerge!: boolean;

    @OneToOne(() => SavedData, { eager: true, cascade: true })
    @JoinColumn()
    public savedData: SavedData;
}
