import {EntryService} from "../../services/EntryService";
import {Inject} from "@tsed/di";
import {Controller, Get, PathParams, UseCache} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import {ListImage} from "../../util/ListImage";
import {ListManager} from "../../services/ListManager";

@Controller("/:user/list/:list/image.png")
export class ListImageController
{
    @Inject()
    protected listManager: ListManager;

    @Get()
    @ContentType('image/png')
    @UseCache({ ttl: 300 })
    public async getIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string
    ) {
        const list = await this.listManager.getList(user.toLowerCase(), listName);

        // @TODO: #1 Change ListImage constructor to use UserListContainer
        const listImage = new ListImage(
            await list.toEntries(),
            await list.toChunkList(),
            listName,
            user
        );

        return listImage.generate();
    }
}