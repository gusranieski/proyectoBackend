import passport from "passport";
import { userService } from "../repository/index.js";
import transport from "../config/gmail.js";
import { twilioClient, twilioPhone } from "../config/twilio.js";

export const passportSignupController = passport.authenticate("register", {
  failureRedirect: "/api/sessions/failure-signup",
});

export const productsRedirectController = (req, res) => {
  res.status(200)
  // .redirect("/products");
  .send("login exitoso");
};

export const passportFailSignup = (req, res) => {
  res.status(401).send(`Usuario no registrado o contraseña incorrecta, <a href="/signup">registrarse</a>`);
};

export const passportLoginController = passport.authenticate("login", {
  failureRedirect: "/api/sessions/failure-login",
});

export const passportFailLogin = (req, res) => {
  res.status(401).send(`Usuario no registrado o contraseña incorrecta, <a href="/signup">registrarse</a>`);
};

export const signupGithubController = passport.authenticate("githubSignup");

export const signupGithubCallbackController = passport.authenticate("githubSignup",{
    failureRedirect:"/api/sessions/failure-signup"
});

export const logoutController = (req, res) => {
  req.logOut((error) => {
    if (error) {
      return res.status(500).send("No se pudo cerrar la sesión");
    } else {
      req.session.destroy((error) => {
        if (error) return res.status(500).send("No se pudo cerrar la sesión");
        res.status(200).send(`Sesión finalizada correctamente, <a href="/login">volver a iniciar sesión</a>`);
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


// export const currentUserController = (req, res) => {
//     if (req.user) {
//       return res.send({ userInfo: req.user });
//     }
//     res.send("Usuario no logueado");
//   };