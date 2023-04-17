import { Router, json } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

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
        const newUser = {
          email,
          password: createHash(password),
          rol
        }
        const newCreated = await userModel.create(newUser);
        req.session.user = newCreated.email;
        return res
        .status(201)
        .redirect("/products");
      }
      //si ya existe enviamos un mensaje que el usuario ya existe
      res.send(`Usuario ya registrado <a href="/login">Inciar sesión</a>`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error interno del servidor");
    }
  });

usersRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email: email });
  
      if (user) {
  
        if (isValidPassword(user, password)) {
          req.session.user = user.email;
          req.session.rol = user.rol;
  
          if (user.email === "adminCoder@coder.com" && user.password === "adminCod3r123") {
            req.session.rol = "admin";
          }
  
          return res.status(200).redirect("/products");
        }
      }
  
      // Si no llega al return dentro del if anterior, significa que la autenticación falló
      res.status(401).send(`Usuario no registrado o contraseña incorrecta, <a href="/signup">registrarse</a>`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error del servidor");
    }
  });

usersRouter.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.status(500).send("La sesión no se pudo cerrar");
    } else {
      res.status(200).redirect("/login");
    }
  });
});

export default usersRouter;


// import { Router, json } from "express";
// import userModel from "../dao/models/user.model.js";

// const usersRouter = Router();
// usersRouter.use(json());

// usersRouter.post("/signup", async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await userModel.findOne({ email: email });
//       if (!user) {
//         //si no existe el usuario lo registramos
//         let rol = "usuario";
//         if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//           rol = "admin";
//         }
//         const newUser = await userModel.create({ email, password, rol });
//         req.session.user = newUser.email;
//         return res
//         .status(201)
//         .redirect("/products");
//       }
//       //si ya existe enviamos un mensaje que el usuario ya existe
//       res.send(`Usuario ya registrado <a href="/login">Inciar sesión</a>`);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send("Error interno del servidor");
//     }
//   });
  

// usersRouter.post("/login", async (req, res) => {
//     try {
//       const { email } = req.body;
//       const user = await userModel.findOne({ email: email });
//       if (!user) {
//         return res.send("Usuario o contraseña incorrectos");
//       }
//       if (user.email === "adminCoder@coder.com" && user.password === "adminCod3r123") {
//         req.session.user = user.email;
//         req.session.rol = "admin";
//       } else {
//         req.session.user = user.email;
//         req.session.rol = user.rol;
//       }
//       res.status(200).redirect("/products");
//     } catch (error) {
//       console.log(error);
//       res.status(401).send("Usuario o contraseña incorrectos");
//     }
//   });
  

// usersRouter.post("/logout", (req, res) => {
//   req.session.destroy((error) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("La sesión no se pudo cerrar");
//     } else {
//       res.status(200).redirect("/login");
//     }
//   });
// });

// export default usersRouter;
