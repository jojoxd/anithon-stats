import {Column, Entity, Generated, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {Property} from "@tsed/schema";
import {SavedData} from "./SavedData";
import {AnilistUser} from "./AnilistUser";

@Entity()
@Index("UQ_IDX_USERLIST", ["user", "listName"], { unique: true })
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
    @Column()
    public listName!: string;

    @Property()
    @ManyToOne(() => AnilistUser, (user) => user.lists, { eager: true })
    @JoinColumn({ name: "userId" })
    public user!: AnilistUser;

    // Settings
    @Column({ default: true })
    public allowChunkMerge!: boolean;

    @OneToOne(() => SavedData, { eager: true, cascade: true })
    @JoinColumn({ name: "savedDataId" })
    public savedData!: SavedData;
}
