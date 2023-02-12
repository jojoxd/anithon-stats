import {ListSettingsDefaults, ListSettingsDto} from "@anistats/shared";

export class ListSettingsHydrator
{
    public static hydrate(listSettings: ListSettingsDto): ListSettingsDto
    {
        listSettings.stackSize ??= ListSettingsDefaults.STACK_SIZE;

        listSettings.allowChunkMerge ??= ListSettingsDefaults.ALLOW_CHUNK_MERGE;

        listSettings.maxChunkLength ??= ListSettingsDefaults.MAX_CHUNK_LENGTH;
        listSettings.maxChunkJoinLength ??= ListSettingsDefaults.MAX_CHUNK_JOIN_LENGTH;

        return listSettings;
    }
}