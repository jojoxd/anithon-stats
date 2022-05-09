import {Inject} from "@tsed/di";
import {Controller, Get, PathParams, UseCache} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import {ListImage} from "../../util/ListImage";
import {ListManager} from "../../services/ListManager";

@Controller("/embed")
export class ListImageController
{
    @Inject()
    protected listManager!: ListManager;

    @Get("/:user/:list.png")
    @ContentType('image/png')
    @UseCache({ ttl: 300 })
    public async getIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string
    ) {
        const container = await this.listManager.getList(user.toLowerCase(), listName);

        const listImage = new ListImage(container);

        return listImage.generate();
    }
}