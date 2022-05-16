import {Column, Entity, Generated, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {Property} from "@tsed/schema";
import {SavedData} from "./SavedData";
import {AnilistUser} from "./AnilistUser";

@Entity()
@Index("UQ_IDX_USERLIST", ["user", "listName"], { unique: true })
export class UserList
{
    @PrimaryColumn()
    @Generated("uuid")
    @Property()
    public id!: string;

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

    /**
     * The Maximum length a Chunk can be (In Minutes)
     */
    @Column({ name: "max_chunk_length", default: UserList.DEFAULT_MAX_CHUNK_LENGTH })
    protected _maxChunkLength?: number;

    public static DEFAULT_MAX_CHUNK_LENGTH = 2.25 * 60;

    public get maxChunkLength(): number
    {
        return this._maxChunkLength ?? UserList.DEFAULT_MAX_CHUNK_LENGTH;
    }

    public set maxChunkLength(value: number)
    {
        this._maxChunkLength = value ?? UserList.DEFAULT_MAX_CHUNK_LENGTH;
    }

    /**
     * If the last Chunk of an entry is less than maxChunkJoinLength minutes, merge the last 2 chunks together
     *
     * Using this, the last chunk can be as large as maxChunkLength + maxChunkJoinLength
     */
    @Column({ name: "max_chunk_join_length", default: UserList.DEFAULT_MAX_CHUNK_JOIN_LENGTH })
    protected _maxChunkJoinLength?: number;

    public static DEFAULT_MAX_CHUNK_JOIN_LENGTH = 0.75 * 60;

    public get maxChunkJoinLength(): number
    {
        return this._maxChunkJoinLength ?? UserList.DEFAULT_MAX_CHUNK_JOIN_LENGTH;
    }

    public set maxChunkJoinLength(value: number)
    {
        this._maxChunkJoinLength = value ?? UserList.DEFAULT_MAX_CHUNK_JOIN_LENGTH;
    }

    // Saved Data
    @OneToOne(() => SavedData, { eager: true, cascade: true })
    @JoinColumn({ name: "savedDataId" })
    public _savedData!: SavedData;

    public get savedData(): SavedData
    {
        this._savedData = this._savedData ?? new SavedData();

        return this._savedData;
    }

    public set savedData(value: SavedData)
    {
        this._savedData = value ?? new SavedData();
    }
}
