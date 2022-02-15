import {EntityRepository, Repository} from "typeorm";
import {SavedData} from "./SavedData";
import {Deprecated} from "@tsed/core";

@EntityRepository(SavedData)
export class SavedDataRepository extends Repository<SavedData>
{

    @Deprecated("Please use UserListRepository or ListManager instead")
    async findOrCreate(listName: string)
    {
        try {
            return await this.findOneOrFail({ listName });
        } catch(ignored) {
            let sd = this.create({ listName, data: {} });
            await this.save(sd);

            return sd;
        }
    }
}
