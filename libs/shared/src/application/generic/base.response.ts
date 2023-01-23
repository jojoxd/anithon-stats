// @TODO: Move to @jojoxd/tsed-exceptions, as a class with `@Property()`s
export interface BaseResponse
{
    /**
     * HTTP Status Code
     */
    readonly status: number;

    /**
     * Response message, if status requires it
     */
    readonly message?: string;
}
