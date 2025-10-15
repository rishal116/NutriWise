import { Schema, model, Document } from "mongoose";

export type UserRole = "user" | "nutritionist" | "admin";
export type Gender = "male" | "female" | "other";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  birthdate?: string;
  gender?: Gender;
  age?: number;
  role: UserRole;
  aboutMe?: string;
  profileImage?: string;
  isVerified: boolean;
  isBlocked: boolean;
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
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password hash is required"],
    },
    birthdate: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
      min: 0,
    },
    role: {
      type: String,
      enum: ["user", "nutritionist", "admin"],
      default: "user",
    },
    aboutMe: {
      type: String,
      maxlength: [300, "About Me must be at most 300 characters"],
    },
    profileImage: {
      type: String, 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

export const UserModel = model<IUser>("User", userSchema);

