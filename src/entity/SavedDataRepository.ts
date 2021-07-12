import {EntityRepository, Repository} from "typeorm";
import {SavedData} from "./SavedData";

@EntityRepository(SavedData)
export class SavedDataRepository extends Repository<SavedData>
{

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
