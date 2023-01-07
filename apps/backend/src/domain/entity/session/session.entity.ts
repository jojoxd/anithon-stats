import {ISession} from "connect-typeorm";
import {Column, DeleteDateColumn, Entity, Index, PrimaryColumn} from "typeorm";

@Entity("session")
export class SessionEntity implements ISession
{
	@PrimaryColumn("varchar", { length: 255 })
	public id: string = "";

	@Index()
	@Column("bigint")
	public expiredAt = Date.now();

	@Column("text")
	public json: string = "";

	@DeleteDateColumn()
	public destroyedAt?: Date;
}
