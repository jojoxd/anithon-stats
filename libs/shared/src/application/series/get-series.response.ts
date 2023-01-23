import { BaseResponse } from "../generic/base.response";
import { SeriesDto } from "../../dto/series/series.dto";

export interface GetSeriesResponse extends BaseResponse
{
    series?: SeriesDto;
}
