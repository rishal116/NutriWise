import { UserRole } from "../../models/user.model";

export class UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;

  constructor(user: { _id: any; fullName?: string; email?: string; role?: UserRole; isBlocked?: boolean }) {
    this.id = user._id.toString();
    this.name = user.fullName || "";
    this.email = user.email || "";
    this.role = user.role || "client";
    this.isBlocked = user.isBlocked || false;
  }
}

export class NutritionistDTO extends UserDTO {
  nutritionistStatus: "approved" | "pending" | "rejected"|"none";

  constructor(user: {
    _id: any;
    fullName?: string;
    email?: string;
    role?: UserRole;
    isBlocked?: boolean;
    nutritionistStatus?: "approved" | "pending" | "rejected"|"none";
  }) {
    super(user); // sets id, name, email, role, isBlocked
    this.nutritionistStatus = user.nutritionistStatus || "pending";
  }
}