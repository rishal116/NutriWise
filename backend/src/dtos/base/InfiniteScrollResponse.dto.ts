import { BaseResponseDto } from "./BaseResponse.dto";

export class InfiniteScrollResponseDto<T> extends BaseResponseDto {
  data: T[];

  total: number;

  skip: number;

  limit: number;

  hasMore: boolean;

  constructor(
    data: T[],
    total: number,
    skip: number,
    limit: number,
    success = true,
    message?: string,
  ) {
    super(success, message);

    this.data = data;
    this.total = total;
    this.skip = skip;
    this.limit = limit;
    this.hasMore = skip + data.length < total;
  }
}