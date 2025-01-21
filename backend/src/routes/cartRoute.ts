import express from "express";
import {
  addItemToCart,
  checkout,
  clearCart,
  deleteItemInCart,
  getActiveCartForUser,
  updateItemInCart,
} from "../services/cartService";
import ValidateJWT from "../middlewares/validateJWT";
import { ExtendRequest } from "../middlewares/validateJWT";
import {orderModel} from "../models/testOrderModel"
const router = express.Router();

router.get("/", ValidateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId, });
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

router.post("/items", ValidateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { quantity, productId } = req.body;
  const response = await addItemToCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
});

router.put("/items", ValidateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await updateItemInCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
});

router.delete(
  "/items/:productId",
  ValidateJWT,
  async (req: ExtendRequest, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const response = await deleteItemInCart({ userId, productId });
    res.status(response.statusCode).send(response.data);
  }
);
router.delete("/", ValidateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const response = await clearCart({ userId });
  res.status(response.statusCode).send(response.data);
});
router.post("/checkout", ValidateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { address } = req.body;
  const response = await checkout({ userId, address });
  res.status(response.statusCode).send(response.data);
});
// confirm order
router.post("/testOrder", async (req, res) => {
  try {
    const { deliveryLocation, fullName, phoneNumber, items, totalPrice } = req.body;

    const newOrder = new orderModel({
      deliveryLocation,
      fullName,
      phoneNumber,
      items,
      totalPrice,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving order", error });
  }
});






export default router;
