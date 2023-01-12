import { EntryEntity } from "../../entity/entry/entry.entity";
import {EntityRepository} from "../../../ext/mikro-orm/entity-repository";

export class EntryRepository extends EntityRepository<EntryEntity>
{
}
