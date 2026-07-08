export interface InfiniteScrollResponseDto<T> {
  success: boolean;
  message?: string;
  error?: string;

  data: T[];
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
}
