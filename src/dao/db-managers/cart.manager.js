import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
export default class CartManager {
  constructor() {}

  getCarts = async () => {
    const carts = await cartModel.find();
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

  addProductToCart = async (cartId, productId, quantity) => {
    const cart = await cartModel.findById(cartId);
  
    if (!cart) {
      console.log(`Error: cart with id ${cartId} not found`);
      return;
    }
  
    const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      const product = await productModel.findById(productId);
      cart.products = [...cart.products, { idProduct: product, quantity: 1 }];
    }
  
    await cart.save();
  
    // Recuperamos el carrito con los datos actualizados
    const result = await cartModel.findById(cartId);
    console.log(JSON.stringify(result, null, "\t"));
    return result;
  };

  deleteCart = async (cartId) => {
    try {
      const deleted = await cartModel.findByIdAndDelete(cartId);
      return deleted;
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el carrito");
    }
  }
}









  // addProductToCart = async (cartId, productId, quantity) => {
  //   const cart = await cartModel.findById(cartId).populate('products.idProduct');
  
  //   if (!cart) {
  //     console.log(`Error: cart with id ${cartId} not found`);
  //     return;
  //   }
  
  //   const productIndex = cart.products.findIndex(p => p.idProduct.toString() === productId);
  //   if (productIndex >= 0) {
  //     cart.products[productIndex].quantity += quantity;
  //   } else {
  //     const product = await productModel.findById(productId);
  //     cart.products.push({ idProduct: product, quantity: 1 });
  //   }
  
  //   const result = await cart.save().populate('products.idProduct');
  //   return result;
  // };
  

//   addProductToCart = async (cartId, productId, quantity) => {
//     const cart = await cartModel.findById(cartId);
//     console.log(cart);
//     if (!cart) {
//       console.log(`Error: cart with id ${cartId} not found`);
//       return;
//     }

//     const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
//     if (productIndex >= 0) {
//       cart.products[productIndex].quantity += quantity;
//     } else {
//       const product = await productModel.findById(productId).populate("products.idProduct");
//       cart.products = [...cart.products, { idProduct: product, quantity: 1 }];
//     }
//     // const result = await cart.save();
//     const result = await cartModel.findByIdAndUpdate(cartId, cart, { new: true });
//     return result;
//   };

