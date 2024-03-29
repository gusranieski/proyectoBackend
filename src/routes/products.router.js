import { Router, json } from "express";
import { productsController } from "../controllers/products.controller.js";
import { checkRole } from "../middlewares/auth.js";
import { uploaderProduct } from "../utils.js";

const productsRouter = Router();

productsRouter.use(json());

productsRouter.get("/", productsController.getAllProducts);
productsRouter.get("/:id", productsController.getProductById);
productsRouter.post("/", checkRole(["admin","premium"]), uploaderProduct.single("thumbnail"),productsController.addProduct);
productsRouter.put("/:id", checkRole(["admin"]), productsController.updateProduct);
productsRouter.delete("/:id", checkRole(["admin", "premium"]), productsController.deleteProduct);

export default productsRouter;
