import { Document, Schema, Types, model } from "mongoose";
import { Gender, UserRole, AuthProvider } from "../enums/user.enum";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  gender?: Gender;
  profileImage?: string;
  password?: string;
  googleId?: string;
  authProvider: AuthProvider;
  emailVerifiedAt?: Date;
  roles: UserRole[];
  activeRole: UserRole;
  isBlocked: boolean;
  isProfileCompleted: boolean;
  lastLoginAt?: Date;
  deletedAt?: Date;
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
      maxlength: 60,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9-]+$/,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    birthDate: Date,

    gender: {
      type: String,
      enum: Object.values(Gender),
    },

    profileImage: String,

    password: {
      type: String,
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.LOCAL,
    },

    emailVerifiedAt: Date,

    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER],
    },

    activeRole: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: Date,

    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function (next) {
  if (!this.roles.includes(this.activeRole)) {
    return next(new Error("Active role must exist in assigned roles"));
  }

  next();
});

userSchema.index({ activeRole: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ deletedAt: 1 });
userSchema.index({ createdAt: -1 });

export const UserModel = model<IUser>("User", userSchema);
