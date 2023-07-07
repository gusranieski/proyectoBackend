import passport from "passport";
import { userService } from "../repository/index.js";
import transport from "../config/gmail.js";
import { twilioClient, twilioPhone } from "../config/twilio.js";

export const passportSignupController = passport.authenticate("register", {
  failureRedirect: "/api/sessions/failure-signup",
});

export const productsRedirectController = (req, res) => {
  req.logger.info("login exitoso");
  res.status(302).redirect("/products");
};

export const passportFailSignup = (req, res) => {
  req.logger.error("registro inválido");
  res.status(401).send(`Usuario ya registrado o campos incompletos, <a href="/signup">registrarse</a>`);
};

export const passportLoginController = passport.authenticate("login", {
  failureRedirect: "/api/sessions/failure-login",
});

export const passportFailLogin = (req, res) => {
  req.logger.error("login inválido");
  res.status(401).send(`Usuario no registrado o contraseña incorrecta, <a href="/signup">registrarse</a>`);
};

export const signupGithubController = passport.authenticate("githubSignup");

export const signupGithubCallbackController = passport.authenticate("githubSignup",{
    failureRedirect:"/api/sessions/failure-signup"
});

export const logoutController = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ status: "error", message: "No se ha iniciado sesión" });
  }

  req.logOut((error) => {
    if (error) {
      return res.status(500).send("No se pudo cerrar la sesión");
    } else {
      req.session.destroy((error) => {
        if (error) {
          return res.status(500).send("No se pudo cerrar la sesión");
        }
        req.logger.info("Sesión finalizada correctamente");
        res.status(200).send({ status: "success", message: "Sesión finalizada correctamente" });
      });
    }
  });
};


export const currentUserController = async (req, res) => {
  if (req.user) {
    try {
      const userDto = await userService.getUser(req.user.id);
      return res.send({ userInfo: userDto });
    } catch (error) {
      res.status(500).send("Error al obtener el usuario actual");
    }
  } else {
    req.logger.info("Usuario no logueado");
    res.send("Usuario no logueado, inicia sesión para acceder");
  }
};

export const allUsersController = async (req, res) => {
  if (req.user) {
    try {
      const userDto = await userService.getUsers(req.user.id);
      return res.send({ userInfo: userDto });
    } catch (error) {
      res.status(500).send("Error al obtener todos los usuarios");
    }
  } else {
    req.logger.info("Usuario no logueado");
    res.send("Usuario no logueado, inicia sesión para acceder");
  }
};

const emailTemplate = `<div>
        <h1>Bienvenido usuario nuevo!!</h1>
        <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
        <p>Ya eres parte de la comunidad</p>
        <a href="http://localhost:8080/login">Haz click en éste enlace para iniciar sesión</a>
</div>`;

export const mailUserController = async(req,res) => {
    try {
        const emailData  = await transport.sendMail({
            from:"Backend ecommerce de Gustavo",
            to:"ranieskigustav@gmail.com",
            subject:"Usuario registrado exitosamente!",
            html:emailTemplate
        });
        console.log("contenido", emailData );
        res.json({ status:"success", message:"Registro y envío de correo exitoso" });
    } catch (error) {
        console.log(error.message);
        res.json({ status:"error", message:"Hubo un error al registrar al usuario" });
    }
};

export const smsUserController = async(req,res) => {
    try {
      const message = await twilioClient.messages.create({
        body:"Compra realizada con éxito!",
        from: twilioPhone,
        to:"+541169736842"
    });
    console.log("message:", message);
    res.json({ status:"success", message:"Compra realizada y envío de sms exitoso" });
    } catch (error) {
    console.log(error.message);
    res.json({ status:"error", message:"Hubo un error al realizar la compra" });
    }
};

export const premiumController = async(req,res) => {
  try {
    const userId = req.params.id;
    // ver si existe el usuario en la db
    const user = await userService.getUser(userId);
    console.log("currentUserRole:", user);
    const userRole = user.role;
    if(userRole === "usuario") {
      user.role = "premium"
    } else if(userRole === "premium") {
      user.role = "usuario"
    } else {
      return res.json({ status:"error", message:"no es posible cambiar el rol del usuario" });
    }
    await userService.updateUser(user.id, user);
    console.log("newUserRole:", user);
    res.send({ status:"success", message:"rol modificado exitosamente"});
  } catch (error) {
    console.log(error.message);
    res.json({ status:"error", message:"Hubo un error al cambiar el rol del usuario" });
  }
}
