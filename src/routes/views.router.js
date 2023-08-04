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
  renderAdminPanel,
  renderPurchase,
  renderCreateProduct,
} from "../controllers/views.controller.js";
import { checkRole } from "../middlewares/auth.js";

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
viewsRouter.get("/admin", checkRole(["admin"]), renderAdminPanel);
viewsRouter.get("/purchase/:ticketId", renderPurchase);
viewsRouter.get("/create-product", renderCreateProduct);

export default viewsRouter;
