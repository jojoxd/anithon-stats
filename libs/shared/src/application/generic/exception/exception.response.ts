import { BaseResponse } from "../base.response";

// @TODO: Move to @jojoxd/tsed-exceptions, as a class with `@Property()`s
export interface ExceptionResponse extends BaseResponse
{
    /**
     * Ensures that this is an error
     */
    readonly isError: true;

    /**
     * Exception Name
     */
    readonly name: string;

    /**
     * Correlation ID of this error
     *
     * This will also be logged in prod logs
     */
    readonly correlationId: string;
}
