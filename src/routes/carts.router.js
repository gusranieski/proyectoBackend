import { Router, json } from "express";
import { CartManager } from "../dao/index.js";

const cartsRouter = Router();
cartsRouter.use(json());

const manager = new CartManager();

// llama a los carritos
cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await manager.getCarts();
    res.send(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
});

// agrega un carrito
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

// llama a un carrito por id
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

// agrega un producto al carrito
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

// elimina un producto del carrito
cartsRouter.delete("/:cid/products/:id", async (req, res) => {
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

// actualiza un carrito
cartsRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body;

    const updatedCart = await manager.updateCart(cartId, products);

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

// actualiza la cantidad de un producto del carrito
cartsRouter.put("/:cid/products/:id", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);

    const updatedCart = await manager.updateCartItemQuantity(cartId, productId, quantity);

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

// elimina un carrito con sus productos
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
