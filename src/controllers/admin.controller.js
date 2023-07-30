import { userService } from "../repository/index.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return res.json({ users });
  } catch (error) {
    res.status(500).send("Error al obtener todos los usuarios");
  }
};

export const updateUserRole = async(req,res) => {
    try {
      const userId = req.params.id;
      // ver si existe el usuario en la db
      const user = await userService.getUser(userId);
      const userRole = user.role;
      //validar si el usuario ya subio todos los documentos, entonces puede ser un ususario premium
      if(user.documents.length<3 && user.status !== "completo"){
        return res.json({status:"error", message:"El usuario no ha subido todos los documentos"});
      }
      if(userRole === "usuario") {
        user.role = "premium"
      } else if(userRole === "premium") {
        user.role = "usuario"
      } else {
        return res.json({ status:"error", message:"no es posible cambiar el rol del usuario" });
      }
      await userService.updateUser(user.id, user);
      res.send({ status:"success", message:`rol modificado exitosamente a: ${user.role}`});
    } catch (error) {
      console.log(error.message);
      res.json({ status:"error", message:"Hubo un error al cambiar el rol del usuario" });
    }
  }

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUser(id);
    console.log(user);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }
    await userService.deleteUser(id);
    return res.status(200).send("Usuario eliminado exitosamente");
  } catch (error) {
    res.status(500).send("Error al eliminar el usuario");
  }
};
