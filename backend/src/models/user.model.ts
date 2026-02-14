import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "client" | "nutritionist" | "admin";

export type Gender = "male" | "female" | "other";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password?: string;
  googleId?: string;
  phone?: string;
  birthdate?: string;
  gender?: Gender;
  age?: number;
  role: UserRole;
  nutritionistStatus?: "pending" | "approved" | "rejected" | "none";
  rejectionReason?: string;
  isBlocked: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
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
    index: true,
  },
  rejectionReason: { type: String, trim: true, default: "" },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
},
{ timestamps: true });

export const UserModel = model<IUser>("User", userSchema);
