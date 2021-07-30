import {BodyParams, Controller, PathParams, Post} from "@tsed/common";
import {Inject} from "@tsed/di";
import {SavedData} from "../../entity/SavedData";
import {SavedDataRepository} from "../../entity/SavedDataRepository";
import {ISavedData} from "@anistats/shared";

@Controller("/:user/list/:list/save")
export class SavedDataController
{
    @Inject()
    protected savedDataRepo: SavedDataRepository;

    @Post()
    public async postIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string,
        @BodyParams('data') data: { [key: string]: ISavedData }
    ) {
        const savedData = await this.savedDataRepo.findOrCreate(listName);

        savedData.data = data;

        await this.savedDataRepo.save(savedData);

        return 'OK';
    }
}