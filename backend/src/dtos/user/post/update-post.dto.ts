import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdatePostDTO {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;
}
