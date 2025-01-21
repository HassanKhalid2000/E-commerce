// src/models/testOrderModel.ts
import { Schema, model } from "mongoose";

// تعريف الواجهة IOrderItem
export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// إنشاء مخطط الطلب
const orderSchema = new Schema({
  deliveryLocation: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  items: [{ type: Object, required: true }],
  totalPrice: { type: Number, required: true },
});

// تصدير النموذج
export const orderModel = model("testOrder", orderSchema);
