import {BeforeInsert, BeforeUpdate, Column, Entity, Generated, OneToMany, PrimaryColumn, UpdateEvent} from "typeorm";
import {ListEntity} from "../list/list.entity";
import {UserId} from "@anistats/shared";

@Entity("user")
export class UserEntity
{
	@PrimaryColumn("uuid")
	@Generated("uuid")
	public id!: UserId;

	@Column()
	public name!: string;

	@Column("simple-json")
	public anilistId!: any;

	@OneToMany(() => ListEntity, (list) => list.user, { eager: true, })
	public lists!: Array<ListEntity>;

	// @TODO: Maybe cache avatar locally?
	@Column()
	public avatarUrl!: string;

	@Column("datetime")
	public createdAt!: Date;

	@Column("datetime", { nullable: true })
	public synchronizedAt!: Date | null;
}
