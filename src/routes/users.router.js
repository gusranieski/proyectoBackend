import { Router, json } from "express";
import userModel from "../dao/models/user.model.js";

const usersRouter = Router();
usersRouter.use(json());

usersRouter.post("/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email: email });
      if (!user) {
        //si no existe el usuario lo registramos
        let rol = "usuario";
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          rol = "admin";
        }
        const newUser = await userModel.create({ email, password, rol });
        req.session.user = newUser.email;
        return res.redirect("/products");
      }
      //si ya existe enviamos un mensaje que el usuario ya existe
      res.send(`Usuario ya registrado <a href="/login">Inciar sesión</a>`);
    } catch (error) {
      console.log(error);
    }
  });
  

usersRouter.post("/login", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res.send("Usuario o contraseña incorrectos");
      }
      if (user.email === "adminCoder@coder.com" && user.password === "adminCod3r123") {
        req.session.user = user.email;
        req.session.rol = "admin";
      } else {
        req.session.user = user.email;
        req.session.rol = user.rol;
      }
      res.redirect("/products");
    } catch (error) {
      console.log(error);
    }
  });
  

usersRouter.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send("La sesion no se pudo cerrar");
    res.redirect("/login");
  });
});

export default usersRouter;
