import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { verifyTokenPass } from "../utils/tokenUtils.js";


export const resetController = async (req, res) => {
    try {
        const token = req.query.token;
        const {email, newPassword} = req.body;
        const validEmail = verifyTokenPass(token);
        if(!validEmail) {
            return res.send(`El enlace expiró, genere un nuevo enlace para generar una nueva contraseña <a href="/forgot-password">Recuperar contraseña</a>`)
        }
        const user = await userModel.findOne({email: email});
        if(!user) {
            return res.send("El usuario no existe");
        }
        if(isValidPassword(user, newPassword)) {
            return res.send("No se puede usar la misma contraseña");
        }
        const userData = {
            // ...user,
            password: createHash(newPassword)
        }
        // console.log("userData:", userData);
        // const userUpdate = await userModel.findOneAndUpdate({email: email}, userData);
        const userUpdate = await userModel.updateOne({email: email}, userData);

        res.render("login", { message: "Contraseña actualizada" });
    } catch (error) {
        res.send(`Error al restablecer la contraseña, <a href="/reset-password">vuelve a intentar</a>`)
        throw error
    }
}