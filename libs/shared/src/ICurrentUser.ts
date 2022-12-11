import {IAnilistUserMetadata} from "./IAnilistUserMetadata";

export type ICurrentUser = {
    isAuthenticated: false;
} | ({
    isAuthenticated: true;
} & IAnilistUserMetadata)
