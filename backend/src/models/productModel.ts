import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  image: string;
  stock: number;
  price: number;
}
const productSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

export const productModel = mongoose.model<IProduct>("Products", productSchema);
