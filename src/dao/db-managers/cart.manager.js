import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { ticketsModel } from "../models/ticket.model.js";
import {v4 as uuidv4} from 'uuid';
import { ProductManagerMongo } from "./product.manager.js";
export class CartManagerMongo {
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

  getTicket = async (cart, userEmail) => {
    try {
      const managerProd = new ProductManagerMongo();

      if(!cart.products.length) {
        return { message: "No tenés productos en tu carrito, agregá algún producto" };
      }

      const ticketProducts = [];
      const rejectedProducts = [];
      let totalAmount = 0;

      for(let i=0; i < cart.products.length; i++) {
        const cartProduct = cart.products[i];
        const productDB = await managerProd.getProductById(cartProduct.idProduct);

        if(cartProduct.quantity <= productDB.stock){
          ticketProducts.push(cartProduct);
          // Suma al total el precio del producto multiplicado por la cantidad
          totalAmount += productDB.price * cartProduct.quantity;
          // Resta la cantidad del carrito al stock de la base de datos
          const updatedStock = productDB.stock - cartProduct.quantity;
          productDB.stock = updatedStock;

          // Actualiza el stock del producto en la base de datos
          await managerProd.updateProduct(productDB.id, productDB);
        } else {
          rejectedProducts.push(cartProduct);
        }
      }

      const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleString(),
        amount: totalAmount,
        purchaser: userEmail
      };
      const ticketCreated = await ticketsModel.create(newTicket);

      // Filtra los productos del carrito y guarda solo los que fueron rechazados durante la compra
      const rejectedProductIds = rejectedProducts.map((product) => product.idProduct);
      cart.products = cart.products.filter((product) => rejectedProductIds.includes(product.idProduct));
      await cart.save();

      // Verifica si hay productos rechazados y envía un mensaje al usuario si es el caso
      if (rejectedProducts.length > 0) {
        return { message: "Quedaron algunos productos sin comprar en el carrito.", ticket: ticketCreated };
      } else {
        return { message: "Compraste todos los productos del carrito!", ticket: ticketCreated };
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error al cargar la compra");
    }
  }

};
