import { Schema, model, Document, Types } from "mongoose";
import { Gender, UserRole } from "../enums/userRole.enum";

export interface IUser extends Document {
  _id: Types.ObjectId;

  fullName: string;
  email: string;
  username: string;

  password?: string;
  googleId?: string;

  profileImage?: string;
  phone?: string;
  birthDate?: Date;
  gender?: Gender;

  roles: UserRole[];
  activeRole: UserRole;

  isBlocked: boolean;
  isDeleted: boolean;
  isProfileCompleted: boolean;

  lastLoginAt?: Date;
  lastActiveAt?: Date;

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

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
      minlength: 3,
      maxlength: 30,
      match: [
        /^[a-z0-9-]+$/,
        "Username can only contain lowercase letters, numbers and hyphens",
      ],
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    birthDate: {
      type: Date,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
    },

    roles: {
      type: [String],
      enum: Object.values(UserRole),
      required: true,
      default: [UserRole.USER],
      validate: {
        validator: (roles: string[]) => roles.length > 0,
        message: "At least one role is required",
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
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
    },

    lastActiveAt: {
      type: Date,
    },
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
userSchema.index({ isDeleted: 1 });
userSchema.index({ createdAt: -1 });

export const UserModel = model<IUser>("User", userSchema);
