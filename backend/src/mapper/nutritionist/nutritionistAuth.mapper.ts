import { NutritionistNameDTO } from "../../dtos/nutritionist/nutritionistAuth.dto";
import { INutritionistProfile } from "../../models/nutritionistProfile.model";
import { IUser } from "../../models/user.model";

export class NutritionistMapper {
  static toNameDTO( user: IUser, nutritionist?: INutritionistProfile ): NutritionistNameDTO {
    return new NutritionistNameDTO( user.fullName, user.email, nutritionist?.profileImage || "/images/images.jpg");
  }
}
