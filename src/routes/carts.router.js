import { Router, json } from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { checkRole } from "../middlewares/auth.js";

const cartsRouter = Router();

cartsRouter.use(json());

cartsRouter.get("/", cartsController.getCarts);
cartsRouter.post("/", cartsController.addCart);
cartsRouter.get("/:cid", cartsController.getCartById);
cartsRouter.post("/:cid/product/:id", checkRole(["usuario"]), cartsController.addProductToCart);
cartsRouter.delete("/:cid/products/:id", cartsController.removeProductFromCart);
cartsRouter.put("/:cid", cartsController.updateCart);
cartsRouter.put("/:cid/products/:id", cartsController.updateCartItemQuantity);
cartsRouter.delete("/:cid", cartsController.deleteCart);

export default cartsRouter;
