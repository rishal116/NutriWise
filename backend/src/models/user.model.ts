import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "client" | "nutritionist" | "admin";
export type AuthProvider = "local" | "google";

export interface IUser {
  _id: Types.ObjectId;

  fullName: string;
  email: string;
  password?: string;
  googleProviderId?: string;

  profileImageUrl?: string;
  phoneNumber?: string;

  authProvider: AuthProvider;
  isEmailVerified: boolean;

  roles: UserRole[];
  activeRole: UserRole;
  permissions?: string[];

  isBlocked: boolean;
  isDeleted: boolean;
  deletedAt?: Date;

  lastLoginAt?: Date;
  lastActiveAt?: Date;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = IUser & Document;

const userSchema = new Schema<IUserDocument>(
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
      index: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
      type: String,
    },
    googleProviderId: {
      type: String,
      index: true,
    },
    profileImageUrl: {
      type: String,
      default: "",
    },
    
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    roles: {
      type: [String],
      enum: ["client", "nutritionist", "admin"],
      default: ["client"],
    },
    activeRole: {
      type: String,
      enum: ["client", "nutritionist", "admin"],
      default: "client",
    },
    permissions: {
      type: [String],
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<IUser>("User", userSchema);
