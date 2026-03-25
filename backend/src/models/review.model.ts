import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  _id:Types.ObjectId;
  user: Types.ObjectId;              
  plan?: Types.ObjectId;            
  nutritionist?: Types.ObjectId;     
  rating: number;                    
  review?: string;                  
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: Schema.Types.ObjectId, ref: "Plan" },
    nutritionist: { type: Schema.Types.ObjectId, ref: "User" }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);