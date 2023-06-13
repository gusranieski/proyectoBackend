import fs from "fs";
import __dirname from "../../utils.js";
import { getNextId } from "./utils.js";

const path = __dirname + "/dao/file-managers/files/carts.json";

export class CartManagerMemory {
  static id = 0;
  #path;

  constructor() {
    this.#path = path;
  }

  // OBTIENE EL ARRAY DE CARTS
  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      return [];
    }
  }

  // AGREGA UN NUEVO CARRITO
  async addCart() {
    try {
      let carts = await this.getCarts();

      const newCart = {
        id: getNextId(carts),
        products: [],
      };

      carts = [...carts, newCart];

      await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  // OBTIENE UN CARRITO POR ID
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cartSearch = carts.find((c) => c.id === parseInt(id));

      if (!cartSearch) {
        throw new Error("Cart not found");
      }

      return cartSearch;
    } catch (error) {
      throw error;
    }
  }

  // AGREGA UN PRODUCTO AL CARRITO
  async addProductToCart(cartId, productId, quantity) {
    try {
      if (!cartId) {
        throw new Error("cartId not found");
      }

      const carts = await this.getCarts();

      const cartIndex = carts.findIndex((c) => c.id === parseInt(cartId));
      const cart = carts[cartIndex];

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const productIndex = cart.products.findIndex((p) => p.id === productId);
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products = [...cart.products, { id: productId, quantity: 1 }];
      }

      carts[cartIndex] = cart;

      await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      throw error;
    }
  }
}
