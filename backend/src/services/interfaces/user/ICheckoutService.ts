export interface ICheckoutService {
  createSession(input: {
    planId: string;
    nutritionistId: string;
    userId: string;
  }): Promise<string>;
}
