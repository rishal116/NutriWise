export class ApiResponseDTO<T = null> {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data?: T,
  ) {}
}