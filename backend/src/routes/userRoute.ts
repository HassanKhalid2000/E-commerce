import express from "express";
import {
  register,
  approveUser,
  rejectUser,
  deleteUser,
  getAllUsers,
  login, // استيراد وظيفة تسجيل الدخول
} from "../services/userServices";

const router = express.Router();

// مسار تسجيل المستخدم
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, accountType } = req.body;
  const { statusCode, data } = await register({
    firstName,
    lastName,
    email,
    password,
    accountType,
  });
  res.status(statusCode).json(data);
});

// مسار تسجيل الدخول
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { statusCode, data } = await login({ email, password });
  res.status(statusCode).json(data);
});

// الحصول على جميع المستخدمين
router.get("/users", async (req, res) => {
  const { data, statusCode } = await getAllUsers();
  res.status(statusCode).json(data);
});

// الموافقة على المستخدم
router.put("/users/approve/:id", async (req, res) => {
  const { id } = req.params;
  const { data, statusCode } = await approveUser(id);
  res.status(statusCode).json(data);
});

// رفض المستخدم
router.put("/users/reject/:id", async (req, res) => {
  const { id } = req.params;
  const { data, statusCode } = await rejectUser(id);
  res.status(statusCode).json(data);
});

// حذف المستخدم
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { data, statusCode } = await deleteUser(id);
  res.status(statusCode).json(data);
});

export default router;
