import { Router, json } from "express";
import { CartManager } from "../dao/index.js";

const cartsRouter = Router();
cartsRouter.use(json());

const manager = new CartManager();

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await manager.getCarts();
    res.send(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    const products = req.body;
    const newCart = await manager.addCart(products);
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await manager.getCartById(cid);
  if (!cart) {
    return res
      .status(404)
      .send({ error: `No existe el carrito con id: ${req.params.cid}` });
  }
  res.send(cart);
});

cartsRouter.post("/:cid/product/:id", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);

    const cart = await manager.addProductToCart(cartId, productId, quantity);

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

cartsRouter.delete("/:cid/product/:id", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity);

  try {
    const manager = new CartManager();
    const updatedCart = await manager.removeProductFromCart(cartId, productId, quantity);
    res.status(200).send({ status: "ok", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", payload: error.message });
  }
});


cartsRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const deletedCart = await manager.deleteCart(cid);

  if (!deletedCart) {
  return res
      .status(404)
      .send({ error: `No existe el carrito con id: ${cid}` });
  }
  res.send({ message: `Carrito con id ${cid} eliminado correctamente`, carts: deletedCart });
});

export default cartsRouter;
