import { Router, json } from "express";
import { CartManager } from "../dao/index.js";
// import CartManager from "../dao/file-managers/cart.manager.js";
// import CartManager from "../managers/CartManager.js";

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
    const products = req.body.products;
    const newCart = await manager.addCart(products);
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const cart = await manager.getCartById(parseInt(id));

  if (!cart) {
    return res
      .status(404)
      .send({ error: `No existe el carrito con id: ${req.params.cid}` });
  }

  res.send(cart);
});

cartsRouter.post("/:cid/product/:id", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.id);
    const quantity = parseInt(req.body.quantity);

    const cart = await manager.addProductToCart(cartId, productId, quantity);

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default cartsRouter;
