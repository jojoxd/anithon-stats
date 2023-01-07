export interface GenericResponse
{
    status: number;

    message: string;

    errors?: Array<string>;
}
