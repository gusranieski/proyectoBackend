import cartModel from "../models/cart.model.js";

export default class CartManager {
  constructor() {}

  getCarts = async () => {
    const carts = await cartModel.find().lean();
    return carts;
  };

  addCart = async () => {
    const newCart = {
      products: [],
    };
    const result = await cartModel.create(newCart);
    return result.toObject();
  };

  getCartById = async (id) => {
    const cart = await cartModel.findById(id).lean();
    if (!cart) {
      console.log("Not Found");
    } else {
      return cart;
    }
  };

  addProductToCart = async (cartId, productId, quantity) => {
    const cart = await cartModel.findById(cartId).lean();
    if (!cart) {
      console.log(`Error: cart with id ${cartId} not found`);
      return;
    }

    const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products = [...cart.products, { idProduct: productId, quantity: 1 }];
    }

    const result = await cartModel.findByIdAndUpdate(cartId, cart, { new: true }).lean();
    return result;
  };
}
