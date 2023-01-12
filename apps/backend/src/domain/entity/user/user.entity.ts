import {ListEntity} from "../list/list.entity";
import {UserId} from "@anistats/shared";
import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import { v4 as uuid4 } from "uuid";
import {UserRepository} from "../../repository/user/user.repository";

@Entity({
	tableName: "user",
	repository: () => UserRepository,
})
export class UserEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: UserId = uuid4() as any as UserId;

	@Property()
	public name!: string;

	@Property({ type: 'json', })
	public anilistId!: any;

	@OneToMany(() => ListEntity, "user", { eager: true, })
	public lists = new Collection<ListEntity>(this);

	// @TODO: Maybe cache avatar locally?
	@Property()
	public avatarUrl!: string;

	@Property()
	public createdAt!: Date;

	@Property({ nullable: true })
	public synchronizedAt?: Date;
}
