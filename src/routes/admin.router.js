import { Router } from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/admin.controller.js";
import { checkRole } from "../middlewares/auth.js";

const adminRouter = Router();

// Ruta para obtener la lista de usuarios (solo accesible para el administrador)
adminRouter.get("/users", checkRole(["admin"]), getAllUsers);
// Ruta para modificar el rol de un usuario (solo accesible para el administrador)
adminRouter.put("/premium/:id", checkRole(["admin"]), updateUserRole);
// Ruta para eliminar un usuario (solo accesible para el administrador)
adminRouter.delete("/users/:id", checkRole(["admin"]), deleteUser);

export default adminRouter;
