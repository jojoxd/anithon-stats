import {GenericResponse, SeriesDto} from "@anistats/shared";

export interface GetSeriesResponse extends GenericResponse
{
    series?: SeriesDto;
}
