import { Router, json } from "express";
import CartManager from "../managers/CartManager.js";

const cartsRouter = Router();
cartsRouter.use(json());

const manager = new CartManager();

cartsRouter.get("/", async(req, res) => {
    const carts = await manager.getCarts();
    const {limit} = req.query
    
        if (limit){
            carts.length = limit
            return res.send(carts)
        } 
    res.send(carts);
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

cartsRouter.get("/:cid", async(req, res) => {
    const id = req.params.cid;
    const cart = await manager.getCartById(parseInt(id));

    if (!cart) {
        return res
        .status(404)
        .send({error:`No existe el carrito con id: ${req.params.cid}`});
    }

    res.send(cart);
});

cartsRouter.post("/:cid/product/:id", async (req, res) => {
    const { cid, id } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await manager.addProductToCart(parseInt(cid), parseInt(id), parseInt(quantity));
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});


export default cartsRouter;