import { Router } from "express";
import { forgotController } from "../controllers/forgot.controller.js";

const forgotRouter = Router();

forgotRouter.post("/forgot-password", forgotController);

export default forgotRouter;

