import fs from "fs";

class CartManager {
    static id = 0;  
  #path;

  constructor(path = "./src/data/carts.json") {
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

      // Actualizar el ID del carrito
      CartManager.id = carts.reduce((maxId, cart) => {
        return cart.id > maxId ? cart.id : maxId;
      }, 0) + 1;

      const newCart = {       
        id: CartManager.id,
        products: [],
      };

      carts = [...carts, newCart];

      await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error(error);
    }
  }

  // OBTIENE UN CARRITO POR ID
  async getCartById(id) {
    const carts = await this.getCarts();
    let cartSearch = carts.find((c) => c.id === id);

    if (cartSearch == undefined) {
      console.log("Not Found");
    } else {
      return cartSearch;
    }
  }

  // AGREGA UN PRODUCTO AL CARRITO
  async addProductToCart(req, res) {
    try {
    const cartId = req.params?.cid ? parseInt(req.params.cid) : null; // Verificación para la propiedad cid
    //   const cartId = parseInt(req.params.cid);
      const productId = parseInt(req.params.id);
      const quantity = parseInt(req.body.quantity);

      if (!cartId) {
        console.log("Error: cartId not found");
        return;
      }
  
      const cart = await this.getCartById(cartId);

      if (!cart) {
        console.log(`Error: cart with id ${cartId} not found`);
        return;
      }

      const productIndex = cart.products.findIndex(p => p.id === productId);
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products = [...cart.products, { id: productId, quantity }];
      }
      
  
      await fs.promises.writeFile(this.#path, JSON.stringify(cart, null, 2));
      return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
      }
  }
}

export default CartManager;
