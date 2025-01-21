import { cartModel } from "../models/cartModel";
import { IOrderItem, orderModel } from "../models/testOrderModel";
import { productModel } from "../models/productModel";

export interface CreateCartForUser {
  userId: string;
}
const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  return cart;
};

export interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}
export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart;
  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate('items.product');
  } else {
    cart = await cartModel.findOne({ userId, status: "active" });
  }
  if (!cart) {
    cart = await createCartForUser({ userId });
  }
  return cart;
};

interface AddItemToCart {
  userId: string;
  quantity: number;
  productId: any;
}
export const addItemToCart = async ({
  userId,
  quantity,
  productId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  const exisitInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );
  if (exisitInCart) {
    return { data: "Item already exists in cart !", statusCode: 400 };
  }

  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "No product found", statusCode: 400 };
  }
  if (product.stock < quantity) {
    return { data: "low stock for items", statusCode: 400 };
  }
  cart.items.push({ product: productId, unitPrice: product.price, quantity });
  cart.totalAmount += product.price * quantity;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface IaddItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}

const addnewItemToCart = async ({
  productId,
  quantity,
  userId,
}: IaddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });
  const exisitInCart = await cart.items.find(
    (p) => p.product.toString() === productId
  );
  if (exisitInCart) {
    return { data: "item Already exisit in cart", statusCode: 400 };
  }
  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "product not available", statusCode: 400 };
  }
  cart.totalAmount += product.price * quantity;
  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });
  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};
// Update Item In Cart
interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const exisitInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );
  if (!exisitInCart) {
    return { data: "item does not exisit in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "product not available", statusCode: 400 };
  }
  if (product.stock < quantity) {
    return { data: "low stock for items", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );
  let total = otherCartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);
  exisitInCart.quantity = quantity;
  total += exisitInCart.quantity * exisitInCart.unitPrice;
  cart.totalAmount = total;
  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

// Delete Item In Cart
interface DeleteItemInCart {
  productId: any;
  userId: string;
}

export const deleteItemInCart = async ({
  userId,
  productId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const exisitInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );
  if (!exisitInCart) {
    return { data: "item does not exisit in cart", statusCode: 400 };
  }
  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );
  const total = otherCartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);
  cart.items = otherCartItems;
  cart.totalAmount = total;
  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};
interface ClearCart {
  userId: string;
}
export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface Checkout {
  userId: string;
  address: string;
}
export const checkout = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: "please add the address", statusCode: 400 };
  }
  const cart = await getActiveCartForUser({ userId });

  const orderItems: IOrderItem[] = [];
  // loop cartItems and create orderItems
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);
    if (!product) {
      return { data: "product not found", statusCode: 400 };
    }
    const orderItem: IOrderItem = {
      name: product.title,          // الاسم يجب أن يكون `name` وليس `productTitle`
      price: item.unitPrice,        // السعر يجب أن يكون `price` وليس `unitPrice`
      quantity: item.quantity,      // الكمية تبقى كما هي
      image: product.image,         // الصورة يجب أن تكون `image` وليس `productImage`
    };
    
    orderItems.push(orderItem);
    console.log(orderItems);
  }
  const order = await orderModel.create({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });
  await order.save();
  console.log(order);

  // updata the cart status to be completed
  cart.status = "completed";
  await cart.save();
  console.log(cart);

  return { data: order, statusCode: 200 };
};
