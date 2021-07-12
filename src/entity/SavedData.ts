import {Column, Entity, PrimaryColumn} from "typeorm";
import {Property} from "@tsed/schema";

@Entity()
export class SavedData
{
    @PrimaryColumn()
    @Property()
    public listName: string;

    @Column("simple-json")
    public data: { [key: string]: { mult: number, order: number; startAt?: number } };
}
