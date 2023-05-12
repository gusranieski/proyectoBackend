import { Router } from "express";
import {
  renderHome,
  renderRealTimeProducts,
  renderProducts,
  renderCarts,
  renderLogin,
  renderSignup,
  renderProfile,
} from "../controllers/views.controller.js";

const viewsRouter = Router();

viewsRouter.get("/", renderHome);
viewsRouter.get("/real-time-products", renderRealTimeProducts);
viewsRouter.get("/products", renderProducts);
viewsRouter.get("/carts/:cid", renderCarts);
viewsRouter.get("/login", renderLogin);
viewsRouter.get("/signup", renderSignup);
viewsRouter.get("/profile", renderProfile);

export default viewsRouter;
