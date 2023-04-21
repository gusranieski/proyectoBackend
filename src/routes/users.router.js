import { Router, json } from "express";
import passport from "passport";

const usersRouter = Router();
usersRouter.use(json());

// ruta del registro
usersRouter.post("/signup", passport.authenticate("register",{
  failureRedirect: "/api/sessions/failure-signup"
}),(req,res) =>{
  res.status(200).redirect("/products");
});

usersRouter.get("/failure-signup", (req,res) => {
  res.status(401).send(`Usuario no registrado o contraseña incorrecta, <a href="/signup">registrarse</a>`);
})

// ruta del login
usersRouter.post("/login", passport.authenticate("login", {
  failureRedirect: "/api/sessions/failure-login",
}), (req, res) => {
  res.status(200).redirect("/products");
});

usersRouter.get("/failure-login", (req,res) => {
  res.status(401).send(`Usuario no registrado o contraseña incorrecta, <a href="/signup">registrarse</a>`);
});

// ruta de github
usersRouter.get("/github", passport.authenticate("githubSignup"));

usersRouter.get("/github-callback",passport.authenticate("githubSignup",{
    failureRedirect:"/api/sessions/failure-signup"
}),(req,res)=>{
    res.send(`Usuario autenticado, <a href="/products">ir a productos</a>`)
})

// ruta del logout
usersRouter.post("/logout",(req,res)=>{
  req.logOut(error=>{
      if(error){
          return res.status(500).send("No se pudo cerrar la sesión");
      }else {
          req.session.destroy(error=>{
              if(error) return res.status(500).send("No se pudo cerrar la sesión");
              res.status(200).send(`Sesión finalizada correctamente, <a href="/login">volver a iniciar sesión</a>`)
          })
      }
  })
});

export default usersRouter;
