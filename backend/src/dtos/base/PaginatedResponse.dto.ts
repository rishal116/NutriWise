import { BaseResponseDto } from "./BaseResponse.dto";

export class PaginatedResponseDto<T> extends BaseResponseDto {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(
    data: T[],
    total: number,
    page: number,
    limit: number,
    success: boolean = true,
    message?: string,
  ) {
    super(success, message);
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
