import transport from "../config/gmail.js";
import { options } from "../config/config.js";

export const sendPasswordResetMail = async (userEmail, token, res) => {
    try {
      // Configurar el correo electrónico
      const mailOptions = await transport.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: "Restablecimiento de contraseña",
        html: `
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="http://localhost:8080/reset-password?token=${token}">
                <button>Restablecer contraseña</button>
                </a>
              `,
      });
      console.log("Correo electrónico enviado:", mailOptions);
      return token;
    } catch (error) {
      console.log(error);
      res.send(`Error al enviar el correo electrónico. <a href="/forgot-password">Vuelve a intentar</a>`);
    }
  };
