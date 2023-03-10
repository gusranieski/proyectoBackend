import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = Router();

const manager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

viewsRouter.get("/real-time-products", async (req, res) => {
  const products = await manager.getProducts();
  res.render("real_time_products", { products });
});

export default viewsRouter;
