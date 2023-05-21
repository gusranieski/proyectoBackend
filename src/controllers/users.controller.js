import passport from "passport";

export const passportSignupController = passport.authenticate("register", {
  failureRedirect: "/api/sessions/failure-signup",
});

export const productsRedirectController = (req, res) => {
  // res.status(200).redirect("/products");
  res.send("login exitoso")
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

export const currentUserController = (req, res) => {
    if (req.user) {
      return res.send({ userInfo: req.user });
    }
    res.send("Usuario no logueado");
  };

