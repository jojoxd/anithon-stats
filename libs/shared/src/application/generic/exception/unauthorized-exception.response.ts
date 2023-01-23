import { ExceptionResponse } from "./exception.response";

export interface UnauthorizedExceptionResponse extends ExceptionResponse
{
    readonly source: "anilist" | "backend";
}
