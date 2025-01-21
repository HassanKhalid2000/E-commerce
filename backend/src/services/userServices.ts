import { userModel } from "../models/userModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: string;
}

export const register = async ({ firstName, lastName, email, password, accountType }: RegisterParams) => {
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    return { data: "User already exists", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    accountType,
    status: "pending", // يبدأ الحساب بحالة "pending"
    role: "user", // تسجيل المستخدمين الجدد كـ "user" بشكل افتراضي
  });

  await newUser.save();
  return { data: "Account created. Awaiting admin approval.", statusCode: 201 };
};

export const approveUser = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  user.status = "approved";
  await user.save();
  return { data: "User approved successfully", statusCode: 200 };
};

export const rejectUser = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  user.status = "rejected";
  await user.save();
  return { data: "User rejected successfully", statusCode: 200 };
};

export const deleteUser = async (userId: string) => {
  const user = await userModel.findByIdAndDelete(userId);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  return { data: "User deleted successfully", statusCode: 200 };
};

export const getAllUsers = async () => {
  const users = await userModel.find({});
  return { data: users, statusCode: 200 };
};

interface ILogin {
  email: string;
  password: string;
}

export const login = async ({ email, password }: ILogin) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "Wrong email or password", statusCode: 400 };
  }

  // التحقق من حالة الحساب إذا لم يكن المستخدم "admin"
  if (findUser.status !== "approved" && findUser.role !== "admin") {
    return { data: "Account is not approved yet. Please contact admin.", statusCode: 403 };
  }

  // التحقق من صحة كلمة المرور
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (passwordMatch) {
    const token = generateJWT({
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      role: findUser.role,
      accountType: findUser.accountType,
    });

    return {
      data: { token, role: findUser.role }, // إرجاع التوكن والدور
      statusCode: 200,
    };
  }

  return { data: "Wrong email or password", statusCode: 400 };
};

const generateJWT = (data: any) => {
  return jwt.sign(data, "F5F797627CE9812FDDEEAD86579F8"); // مفتاح توقيع التوكن
};
