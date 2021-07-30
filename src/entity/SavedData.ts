import {Column, Entity, PrimaryColumn} from "typeorm";
import {Property} from "@tsed/schema";
import {ISavedData} from "@anistats/shared";

@Entity()
export class SavedData
{
    @PrimaryColumn()
    @Property()
    public listName: string;

    @Column("simple-json")
    public data: { [key: string]: ISavedData };
}
