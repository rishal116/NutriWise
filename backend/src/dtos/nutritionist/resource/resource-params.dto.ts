import { IsMongoId } from "class-validator";

export class GetNutriResourceParamsDTO {
  @IsMongoId()
  resourceId!: string;
}
