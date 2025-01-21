import express, { json } from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { seedInitialProducts } from "./services/productService";
import cors from "cors";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import { userModel } from "./models/userModels";
import bcrypt from "bcrypt";

const app = express();
const port = 5005;

app.use(express.json());
app.use(cors());

// اتصال MongoDB
mongoose
  .connect("mongodb://localhost:27017/E-commerce")
  .then(() => {
    console.log("Mongo connected");
    createAdminAccount(); // إنشاء حساب المدير عند الاتصال بـ MongoDB
  })
  .catch((err) => console.log("Failed to connect", err));

// إضافة المنتجات الافتراضية إلى قاعدة البيانات
seedInitialProducts();

// تعريف المسارات
app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);

// تشغيل التطبيق
app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});

// إنشاء حساب المدير الافتراضي
const createAdminAccount = async () => {
  try {
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123"; // تأكد من اختيار كلمة مرور قوية

    // التحقق مما إذا كان حساب المدير موجودًا بالفعل
    const existingAdmin = await userModel.findOne({ email: adminEmail, role: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = new userModel({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: hashedPassword,
        accountType: "admin",
        status: "approved",
        role: "admin",
      });
      await admin.save();
      console.log(`Admin account created: ${adminEmail}`);
    } else {
      console.log("Admin account already exists");
    }
  } catch (err) {
    console.error("Error creating admin account:", err);
  }
};
