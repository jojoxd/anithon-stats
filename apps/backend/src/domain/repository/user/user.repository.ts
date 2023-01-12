import {UserEntity} from "../../entity/user/user.entity";
import {EntityRepository} from "../../../ext/mikro-orm/entity-repository";

export class UserRepository extends EntityRepository<UserEntity>
{
}
