import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CancelNutriProgramDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  cancellationReason!: string;
}
