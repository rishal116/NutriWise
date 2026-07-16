export interface InfiniteScrollResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}