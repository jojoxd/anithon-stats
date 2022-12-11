import {SqliteDataSource} from "../../datasources/SqliteDataSource";
import {SavedData} from "../SavedData";
import {registerProvider} from "@tsed/di";

export const SavedDataRepository = SqliteDataSource.getRepository(SavedData);

export const SAVEDDATA_REPOSITORY = Symbol.for("SavedDataRepository");
export type SAVEDDATA_REPOSITORY = typeof SavedDataRepository;

registerProvider<SAVEDDATA_REPOSITORY>({
    provide: SAVEDDATA_REPOSITORY,
    useValue: SavedDataRepository,
});
