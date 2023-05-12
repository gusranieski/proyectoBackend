import { Router, json } from "express";
import { productsController } from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.use(json());

productsRouter.get("/", productsController.getAllProducts);
productsRouter.get("/:id", productsController.getProductById);
productsRouter.post("/", productsController.addProduct);
productsRouter.put("/:id", productsController.updateProduct);
productsRouter.delete("/:id", productsController.deleteProduct);

export default productsRouter;
