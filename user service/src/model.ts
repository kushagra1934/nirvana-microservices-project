import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

//define the IUser interface extending mongoose Document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}


//making the schema with IUser 
const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    playlist: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", schema);
