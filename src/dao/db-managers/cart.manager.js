import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
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
    const cart = await cartModel.findById(id);
    if (!cart) {
      console.log("Not Found");
    } else {
      return cart;
    }
  };

  addProductToCart = async (cartId, productId) => {
    const cart = await cartModel.findById(cartId);

    if (!cart) {
      console.log(`Error: cart with id ${cartId} not found`);
      return;
    }
    const productIndex = cart.products.findIndex((p) => p.idProduct && p.idProduct._id.toString() === productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity++;
    } else {
      const product = await productModel.findById(productId);
      cart.products = [...cart.products, { idProduct: product, quantity: 1 }];
    }
  
    await cart.save();
  
    // Recupera el carrito con los datos actualizados
    const result = await cartModel.findById(cartId);
    return result;
  };

  removeProductFromCart = async (cartId, productId) => {
    const cart = await cartModel.findById(cartId);

    if (!cart) {
      console.log(`Error: cart with id ${cartId} not found`);
      return;
    }
  
    const productIndex = cart.products.findIndex((p) => p.idProduct._id.toString() === productId);
    if (productIndex < 0) {
      console.log(`Error: product with id ${productId} not found in cart with id ${cartId}`);
      return;
    }

    cart.products.splice(productIndex, 1);
    await cart.save();
  
    // Recupera el carrito con los datos actualizados
    const result = await cartModel.findById(cartId);
    return result;
  };

  updateCart = async (cartId, products) => {
    const cart = await cartModel.findById(cartId);
  
    if (!cart) {
      console.log(`Error: cart with id ${cartId} not found`);
      return;
    }
  
    cart.products = products;
    await cart.save();
  
    // Recupera el carrito con los datos actualizados
    const result = await cartModel.findById(cartId);
    return result;
  };
  
  updateCartItemQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const cartItem = cart.products.find((item) => item.idProduct._id.toString() === productId);
      if (!cartItem) {
        throw new Error("Product not found in cart");
      }
      cartItem.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }
  
  deleteCart = async (cartId) => {
    try {
      const deleted = await cartModel.findByIdAndDelete(cartId);
      return deleted;
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el carrito");
    };
  };
};
