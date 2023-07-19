import { Router, json } from "express";
import { currentUserController, allUsersController, mailUserController, smsUserController, premiumController, uploaderDocsController } from "../controllers/users.controller.js";
import { checkRole } from "../middlewares/auth.js";
import { uploaderDocument } from "../utils.js";
import { checkAuthenticated } from "../middlewares/checkAuthenticated.js";

const usersRouter = Router();

usersRouter.use(json());
// ruta current
usersRouter.get("/current", currentUserController);
// ruta todos los users
usersRouter.get("/", allUsersController);
// ruta mail
usersRouter.post("/mail", mailUserController);
// ruta sms
usersRouter.post("/sms", smsUserController);
// ruta de roles
usersRouter.put("/premium/:id", checkRole(["admin"]), premiumController);
// ruta documents
usersRouter.put("/:id/documents", checkAuthenticated, uploaderDocument.fields([{name:"identificacion",maxCount:1}, {name:"domicilio",maxCount:1},{name:"estadoDeCuenta",maxCount:1}]), uploaderDocsController);

export default usersRouter;
