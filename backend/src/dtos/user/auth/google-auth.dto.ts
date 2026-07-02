import { IsNotEmpty, IsString } from "class-validator";

export class GoogleAuthDto {
  @IsNotEmpty({ message: "Google credential is required" })
  @IsString()
  credential!: string;
}
