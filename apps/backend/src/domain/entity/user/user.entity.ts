import {ListEntity} from "../list/list.entity";
import {AnilistUserId, UserId} from "@anistats/shared";
import {Collection, Entity, OneToMany, PrimaryKey, Property, TextType} from "@mikro-orm/core";
import {UserRepository} from "../../repository/user/user.repository";
// import {EncryptedStringDataType} from "../../mikro-orm/data-type/encrypted-string.data-type";
import { createId } from "../../util/create-id.fn";

@Entity({
	tableName: "user",
	repository: () => UserRepository,
})
export class UserEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: UserId = createId<UserId>();

	@Property()
	public name!: string;

	@Property({ type: 'json', })
	public anilistId!: AnilistUserId;

	// @TODO: Use EncryptedStringDataType instead of StringType here.
	@Property({ type: TextType, nullable: true, })
	public anilistToken?: string;

	@OneToMany(() => ListEntity, "user", { eager: true, })
	public lists = new Collection<ListEntity>(this);

	// @TODO: Maybe cache avatar locally? would use <uuid>.png, note that gif should also be supported
	@Property()
	public avatarUrl!: string;

	// @TODO: Save banner

	@Property()
	public createdAt!: Date;

	@Property({ nullable: true })
	public synchronizedAt?: Date;
}
