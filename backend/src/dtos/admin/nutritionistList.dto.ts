import { UserRole } from "../../models/user.model";

export class NutritionistListDTO {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  nutritionistStatus: "approved" | "pending" | "rejected" | "none";

  constructor(user: any) {
    this.id = user._id.toString();
    this.fullName = user.fullName || "";
    this.email = user.email || "";
    this.role = user.role || "client";
    this.isBlocked = user.isBlocked ?? false;
    this.nutritionistStatus = user.nutritionistStatus || "none";
  }
}
