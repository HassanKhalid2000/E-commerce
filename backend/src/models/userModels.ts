import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: string; // "pending", "approved", "rejected"
  accountType: string; // "supplier", "customer"
  role: string; // "admin", "user"
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  accountType: { type: String, required: true },
  role: { type: String, required: true, default: "user" }, // Default role is "user"
});

export const userModel = mongoose.model<IUser>("users", userSchema);
