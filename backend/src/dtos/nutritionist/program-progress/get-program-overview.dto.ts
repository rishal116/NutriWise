import { IsMongoId } from "class-validator";

export class GetProgramOverviewDTO {
  @IsMongoId()
  clientId!: string;

  @IsMongoId()
  userProgramId!: string;
}