import passport from "passport";
import { userService } from "../repository/index.js";

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
  const user = req.user;
  user.last_connection = new Date().toLocaleString();
  
  if (!req.isAuthenticated()) {
    req.logger.warning("No se ha iniciado sesión");
    return res.status(401).send(`No se ha iniciado sesión, <a href="/login">volver a iniciar sesión</a>`);
  }
  
  req.logOut((error) => {
    if (error) {
      return res.status(500).send("No se pudo cerrar la sesión");
    } else {
      req.session.destroy(async(error) => {
        if (error) {
          return res.status(500).send("No se pudo eliminar la sesión");
        }
        const userUpdated = await userService.updateUser(user._id, user);
        req.logger.info("Sesión finalizada correctamente");
        res.status(200).send(`Sesión finalizada correctamente, <a href="/login">volver a iniciar sesión</a>`);
      });
    }
  });
};
