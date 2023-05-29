import { Router } from "express";
import { createMockProducts } from "../controllers/mock.products.controller.js";

const mocksProductsRouter = Router();

mocksProductsRouter.get("/", createMockProducts);

export default mocksProductsRouter;
