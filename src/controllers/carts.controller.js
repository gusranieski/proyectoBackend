import { CartManager } from "../dao/index.js";

const manager = new CartManager();

export const cartsController = {
  async getCarts(req, res) {
    try {
      const carts = await manager.getCarts();
      res.send(carts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los carritos" });
    }
  },

  async addCart(req, res) {
    try {
      const products = req.body;
      const newCart = await manager.addCart(products);
      res.status(201).json(newCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  },

  async getCartById(req, res) {
    const { cid } = req.params;
    const cart = await manager.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .send({ error: `No existe el carrito con id: ${req.params.cid}` });
    }
    res.send(cart);
  },

  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.id;
      const quantity = parseInt(req.body.quantity);

      const cart = await manager.addProductToCart(cartId, productId, quantity);

      return res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al agregar el producto al carrito" });
    }
  },

  async removeProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);

    try {
      const updatedCart = await manager.removeProductFromCart(
        cartId,
        productId,
        quantity
      );
      res.status(200).send({ status: "ok", payload: updatedCart });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", payload: error.message });
    }
  },

  async updateCart(req, res) {
    try {
      const cartId = req.params.cid;
      const products = req.body;

      const updatedCart = await manager.updateCart(cartId, products);

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el carrito" });
    }
  },

  async updateCartItemQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.id;
      const quantity = parseInt(req.body.quantity);

      const updatedCart = await manager.updateCartItemQuantity(
        cartId,
        productId,
        quantity
      );

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el carrito" });
    }
  },

  async deleteCart(req, res) {
    const { cid } = req.params;
    const deletedCart = await manager.deleteCart(cid);

    if (!deletedCart) {
      return res
        .status(404)
        .send({ error: `No existe el carrito con id: ${cid}` });
    }
    res.send({
      message: `Carrito con id ${cid} eliminado correctamente`,
      carts: deletedCart,
    });
  },

  async getPurchase(req, res) {
    try {
      const { cid } = req.params;
      const cart = await manager.getCartById(cid);

      if (cart) {
        const purchaseResult = await manager.getTicket(cart, req.user.email);

        res.send(purchaseResult);
      } else {
        res.send("El carrito no se encuentra");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al cargar la compra" });
    }
  },
};
