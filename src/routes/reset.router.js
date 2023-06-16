import { Router } from "express";
import { resetController } from "../controllers/reset.controller.js";

const resetRouter = Router();

resetRouter.post("/reset-password", resetController);

export default resetRouter;

