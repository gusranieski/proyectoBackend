import { Router } from "express";
import {
  renderHome,
  renderRealTimeProducts,
  renderProducts,
  renderCart,
  renderLogin,
  renderSignup,
  renderProfile,
  renderForgotPassword,
  renderResetPassword,
} from "../controllers/views.controller.js";

const viewsRouter = Router();

viewsRouter.get("/", renderHome);
viewsRouter.get("/real-time-products", renderRealTimeProducts);
viewsRouter.get("/products", renderProducts);
viewsRouter.get("/carts/:cid", renderCart);
viewsRouter.get("/login", renderLogin);
viewsRouter.get("/signup", renderSignup);
viewsRouter.get("/profile", renderProfile);
viewsRouter.get("/forgot-password", renderForgotPassword);
viewsRouter.get("/reset-password", renderResetPassword);

export default viewsRouter;
