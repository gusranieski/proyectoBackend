import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = Router();

const manager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products, style: "index" });
});

viewsRouter.get("/real-time-products", (req, res) => {
  res.render("real_time_products",);
});

export default viewsRouter;
