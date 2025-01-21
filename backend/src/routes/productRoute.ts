import express from "express";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "../services/productService";

const router = express.Router();

// جلب جميع المنتجات
router.get("/", (async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
}) as express.RequestHandler);

// إضافة منتج جديد
router.post("/create", (async (req, res) => { // تعديل المسار إلى /create
  try {
    const { title, image, price, stock } = req.body;

    // التحقق من صحة البيانات المدخلة
    if (!title || !image || !price || stock == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = { title, image, price, stock };
    const addedProduct = await addProduct(newProduct);
    res.status(201).json(addedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err });
  }
}) as express.RequestHandler);

// تحديث منتج
router.put("/:id", (async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await updateProduct(id, updatedData);
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
}) as express.RequestHandler);

// حذف منتج
router.delete("/:id", (async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteProduct(id);
    if (result) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
}) as express.RequestHandler);

export default router;
