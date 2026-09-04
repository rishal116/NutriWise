import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePostDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content?: string;
}
