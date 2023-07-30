import { Router, json } from "express";
import {
  currentUserController,
  allUsersController,
  mailUserController,
  smsUserController,
  uploaderDocsController,
  deleteInactiveUsersController,
} from "../controllers/users.controller.js";
import { uploaderDocument } from "../utils.js";
import { checkAuthenticated } from "../middlewares/checkAuthenticated.js";

const usersRouter = Router();

usersRouter.use(json());

// Rutas para obtener el usuario actual y la lista de todos los usuarios
usersRouter.get("/current", currentUserController);
usersRouter.get("/", allUsersController);

// Rutas para el envío de correo y SMS
usersRouter.post("/mail", mailUserController);
usersRouter.post("/sms", smsUserController);

// Ruta para cargar los documentos del usuario
usersRouter.put("/:id/documents", checkAuthenticated, uploaderDocument.fields([{ name: "identificacion", maxCount: 1 },{ name: "domicilio", maxCount: 1 },{ name: "estadoDeCuenta", maxCount: 1 },]), uploaderDocsController);

// Ruta DELETE para eliminar usuarios inactivos
usersRouter.delete("/deleteInactive", deleteInactiveUsersController);

export default usersRouter;
