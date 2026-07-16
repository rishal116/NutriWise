export class InfiniteScrollResponseDTO<T> {
  constructor(
    public readonly items: T[],
    public readonly nextCursor: string | null,
    public readonly hasMore: boolean,
  ) {}
}