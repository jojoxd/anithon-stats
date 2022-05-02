import {ISession} from "@jojoxd/connect-typeorm";
import {Column, Entity, Index, PrimaryColumn} from "typeorm";

@Entity()
export class Session implements ISession
{
    @PrimaryColumn("varchar", { length: 255 })
    public id: string = "";

    @Index()
    @Column("bigint")
    public expiredAt = Date.now();

    @Column("text")
    public json: string = "";
}
