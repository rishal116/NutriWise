export class CreateCheckoutSessionDTO {
  constructor(
    public readonly planId: string,
    public readonly nutritionistId: string,
    public readonly userId: string
  ) {}
}
