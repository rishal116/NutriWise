import { IUserDTOInput, UserDTO, NutritionistStatusDTO } from "../../dtos/admin/user.dto";

export class UserMapper {

  static toUserDTO(user: IUserDTOInput): UserDTO {
    return new UserDTO(user);
  }

  static toUserDTOList(users: IUserDTOInput[]): UserDTO[] {
    return users.map((user) => this.toUserDTO(user));
  }

  static toNutritionistStatusDTO(user: IUserDTOInput): NutritionistStatusDTO {
    return new NutritionistStatusDTO(user);
  }

  static toNutritionistStatusDTOList(users: IUserDTOInput[]): NutritionistStatusDTO[] {
    return users.map((user) => this.toNutritionistStatusDTO(user));
  }
}