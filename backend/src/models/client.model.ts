import { Schema, model, Document } from "mongoose";

export interface IClient extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  birthdate?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  profileImage?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
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
      required: [true, "Password is required"],
    },
    birthdate: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, min: 0 },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "clients" }
);

export const ClientModel = model<IClient>("Client", clientSchema);
