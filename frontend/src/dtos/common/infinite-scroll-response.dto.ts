export interface InfiniteScrollResponseDTO<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}