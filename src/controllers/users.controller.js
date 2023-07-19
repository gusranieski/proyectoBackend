import { userService } from "../repository/index.js";
import transport from "../config/gmail.js";
import { twilioClient, twilioPhone } from "../config/twilio.js";

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
      //validar si el usuario ya subio todos los documentos, entonces puede ser un ususario premium
      if(user.documents.length<3 && user.status !== "completo"){
        return res.json({status:"error", message:"El usuario no ha subido todos los documentos"});
      }
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
  
  export const uploaderDocsController = async(req,res) => {
    try {
      const userId = req.params.id;
      const user = await userService.getUser(userId);
      if(user) {
        console.log(req.files);
        const identificacion = req.files['identificacion']?.[0] || null;
        const domicilio = req.files['domicilio']?.[0] || null;
        const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
        const docs = [];
        if(identificacion){
            docs.push({name:"identificacion",reference:identificacion.filename});
        }
        if(domicilio){
            docs.push({name:"domicilio",reference:domicilio.filename});
        }
        if(estadoDeCuenta){
            docs.push({name:"estadoDeCuenta",reference:estadoDeCuenta.filename});
        }
        if(docs.length === 3){
            user.status = "completo";
        } else {
            user.status = "incompleto";
        }
        user.documents = docs;
        await userService.updateUser(user.id, user);
        res.json({ status:"success", message:"Se actualizaron los documentos" });
      }else {
        res.json({ status:"error", message:"No se pueden cargar los documentos" });
      }
    } catch (error) {
      console.log(error.message);
      res.json({ status:"error", message:"Hubo un error al cargar los documentos" });
    }
  }