import { generateTokenPass } from "../utils/tokenUtils.js";
import { sendPasswordResetMail } from "../utils/emailUtils.js";
import { userService } from "../repository/index.js";


export const forgotController = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await userService.getUserByEmail(email);
        if(!user) {
            return res.send(`Error, mail no registrado, <a href="/forgot-password">vuelve a intentar</a>`)
        }
        const token = generateTokenPass(email, 5*60);
        await sendPasswordResetMail(email, token);
        res.send(`Se envió un mail a tu cuenta para restablecer la contraseña, <a href="/login">volver a iniciar sesión</a>`)
    } catch (error) {
        console.log(error);
        res.send(`Error al restablecer la contraseña, <a href="/forgot-password">vuelve a intentar</a>`)
    }
};
