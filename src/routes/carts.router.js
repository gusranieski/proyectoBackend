import { Router, json } from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { checkRole } from "../middlewares/auth.js";

const cartsRouter = Router();

cartsRouter.use(json());

cartsRouter.get("/", cartsController.getCarts);
cartsRouter.post("/", cartsController.addCart);
cartsRouter.get("/:cid", cartsController.getCartById);
cartsRouter.post("/:cid/product/:id", checkRole(["usuario", "premium"]), cartsController.addProductToCart);
cartsRouter.delete("/:cid/products/:id", cartsController.removeProductFromCart);
cartsRouter.put("/:cid/emptycart", cartsController.emptyCart);
cartsRouter.put("/:cid", cartsController.updateCartWithProducts);
cartsRouter.put("/:cid/products/:id", cartsController.updateCartItemQuantity);
cartsRouter.delete("/:cid", cartsController.deleteCart);
cartsRouter.post("/:cid/purchase", cartsController.getPurchase);//ruta para generar el ticket
cartsRouter.get("/purchase/:ticketId", cartsController.showTicket);//ruta para obtener y renderizar el ticket

export default cartsRouter;
