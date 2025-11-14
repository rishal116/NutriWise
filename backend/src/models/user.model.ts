import { Schema, model, Document } from "mongoose";

export type UserRole = "client" | "nutritionist" | "admin";
export type Gender = "male" | "female" | "other";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?: string;
  birthdate?: string;
  gender?: Gender;
  age?: number;
  role: UserRole;
  nutritionistStatus?: string;
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
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name must be at most 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
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

    password: {
      type: String,
      required: false,
    },

    googleId: {
      type: String,
      required: false,
    },

    birthdate: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, min: 0 },

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
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: { type: String },
    isBlocked: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
