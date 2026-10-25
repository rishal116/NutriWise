import { IsEnum } from "class-validator";

import { UserRole } from "../../../enums/user.enum";

export class SwitchRoleDto {
  @IsEnum(UserRole, {
    message: "Role must be a valid user role.",
  })
  role!: UserRole;
}
