import { Schema, model, Document } from "mongoose";

export type UserRole = "client" | "nutritionist" | "admin";

export type Gender = "male" | "female" | "other";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?: string;
  birthdate?: string;
  gender?: Gender;
  age?: number;
  role: UserRole;
  nutritionistStatus?: "pending" | "approved" | "rejected" | "none";
  rejectionReason?: string;
  profileImage?: string;
  isBlocked: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    password: { type: String },

    googleId: { type: String },

    birthdate: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number },

    role: {
      type: String,
      enum: ["client", "nutritionist", "admin"],
      default: "client",
    },

    nutritionistStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "none"],
      default: "none",
    },

    rejectionReason: { type: String, trim: true, default: "" },

    profileImage: { type: String },

    isBlocked: { type: Boolean, default: false },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
