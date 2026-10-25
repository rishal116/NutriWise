import { Schema, Types, model } from "mongoose";

import { AuthProvider, Gender, UserRole } from "../enums/user.enum";

export interface IUser {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  gender?: Gender;
  profileImage?: string;
  birthDate?: Date;
  password?: string;
  googleId?: string;
  authProvider: AuthProvider;
  emailVerifiedAt?: Date | null;
  roles: UserRole[];
  activeRole: UserRole;
  isBlocked: boolean;
  isProfileCompleted: boolean;
  deletedAt?: Date | null;
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

    gender: {
      type: String,
      enum: Object.values(Gender),
    },

    profileImage: {
      type: String,
      trim: true,
    },
    
    birthDate: {
      type: Date,
      validate: {
        validator: (value: Date | undefined) =>
          value === undefined || value.getTime() <= Date.now(),
        message: "Birth date cannot be in the future.",
      },
    },

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
      required: true,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    roles: {
      type: [
        {
          type: String,
          enum: Object.values(UserRole),
        },
      ],
      required: true,
      default: [UserRole.USER],
      validate: {
        validator: (roles: UserRole[]) =>
          roles.length > 0 && new Set(roles).size === roles.length,
        message: "Roles must contain at least one unique role.",
      },
    },

    activeRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.USER,
    },

    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },

    isProfileCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function () {
  if (!this.roles.includes(this.activeRole)) {
    throw new Error("Active role must exist in assigned roles.");
  }
});

userSchema.index({ deletedAt: 1 });
userSchema.index({ activeRole: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ createdAt: -1 });

export const UserModel = model<IUser>("User", userSchema);
