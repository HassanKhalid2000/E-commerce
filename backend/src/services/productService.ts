import { productModel } from "../models/productModel";

// جلب جميع المنتجات
export const getAllProducts = async () => {
  return await productModel.find();
};

// إضافة منتج جديد
export const addProduct = async (productData: { title: string, image: string, price: number, stock: number }) => {
  try {
    const newProduct = new productModel(productData);
    await newProduct.save();
    return newProduct;
  } catch (err) {
    throw new Error("Error adding product");
  }
};

// تحديث منتج
export const updateProduct = async (id: string, updatedData: { title?: string, image?: string, price?: number, stock?: number }) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedProduct;
  } catch (err) {
    throw new Error("Error updating product");
  }
};

// حذف منتج
export const deleteProduct = async (id: string) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    return deletedProduct;
  } catch (err) {
    throw new Error("Error deleting product");
  }
};

// دالة لتعبئة البيانات الأولية
export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "Mac Air m1 ",
        image:
          "https://www.google.com/imgres?q=macbook%20m1&imgurl=https%3A%2F%2Fwww.apple.com%2Fnewsroom%2Fimages%2Fproduct%2Fmac%2Fstandard%2FApple_new-macbookair-wallpaper-screen_11102020_big.jpg.large.jpg&imgrefurl=https%3A%2F%2Fwww.apple.com%2Fnewsroom%2F2020%2F11%2Fintroducing-the-next-generation-of-mac%2F&docid=DKJiINMrf87DZM&tbnid=aOZ5RhRr4QPlyM&vet=12ahUKEwi11Yefo6mKAxULxQIHHZnyIIUQM3oECGUQAA..i&w=980&h=861&hcb=2&ved=2ahUKEwi11Yefo6mKAxULxQIHHZnyIIUQM3oECGUQAA",
        price: 40000,
        stock: 10,
      },
      {
        title: "Mercedes ",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBmBumXgjoOGtpEBYsglSz21dP44ADyjARoQ&s",
        price: 30000000,
        stock: 5,
      },
      {
        title: "IPhone 16 PRO MAX",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqRdP5X0phTACrCkFmCjgNSryF1AmdiZAMjzTRDfg49ZUNXhXScNve31fIy59CNloGZeM&usqp=CAU",
        price: 10000,
        stock: 30,
      },
    ];
    const existingProducts = await getAllProducts();
    if (existingProducts.length === 0) {
      await productModel.insertMany(products);
    }
  } catch (err) {
    console.error("Cannot seed initial products", err);
  }
};
