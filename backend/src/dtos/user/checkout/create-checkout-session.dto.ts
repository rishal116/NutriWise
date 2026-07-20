import { IsMongoId } from "class-validator";

export class CreateCheckoutSessionDTO {
  @IsMongoId()
  planId!: string;

  @IsMongoId()
  userId!: string;
}