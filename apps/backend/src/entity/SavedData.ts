import {Column, Entity, PrimaryColumn} from "typeorm";
import {Property} from "@tsed/schema";
import {SavedDataDto} from "@anistats/shared";

@Entity()
export class SavedData
{
    @PrimaryColumn({ generated: "increment" })
    @Property()
    public id!: number;

    @Column("simple-json")
    public data: { [key: string]: SavedDataDto } = {};
}
