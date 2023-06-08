import { Router } from "express";
import { testLoggerLevels } from "../controllers/logger.controller.js";

const loggerRouter = Router();

loggerRouter.get("/", testLoggerLevels);

export default loggerRouter;
