import {Inject} from "@tsed/di";
import {Controller, Get, UseCache} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import {ListImage} from "../../util/ListImage";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {UserListContainerManager} from "../../services/UserListContainerManager";

@Controller("/list/:listId")
export class ListImageController
{
    @Inject()
    protected userListContainerManager!: UserListContainerManager;

    @Get("/embed.png")
    @ContentType('image/png')
    @UseCache({ ttl: 300 })
    public async getIndex(
        @PathParamEntity("listId") list: UserList
    ) {
        const container = await this.userListContainerManager.createFromList(list);

        const listImage = new ListImage(container);

        return listImage.generate();
    }
}