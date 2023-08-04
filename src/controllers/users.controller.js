import { userService } from "../repository/index.js";
import transport from "../config/gmail.js";
import { twilioClient, twilioPhone, testPhoneNumber } from "../config/twilio.js";

export const currentUserController = async (req, res) => {
  if (req.user) {
    try {
      const userDto = await userService.getUser(req.user.id);
      return res.send({ user: userDto });
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
      const AllUsersDto = await userService.getUsers(req.user.id);
      return res.send({ users: AllUsersDto });
    } catch (error) {
      res.status(500).send("Error al obtener todos los usuarios");
    }
  } else {
    req.logger.info("Usuario no logueado");
    res.send("Usuario no logueado, inicia sesión para acceder");
  }
};

export const mailUserController = async (user) => {
  try {
    const emailTemplate = `<div>
    <h1>Bienvenido ${user.first_name}!!</h1>
    <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
    <p>Ya eres parte de la comunidad</p>
    <a href="http://localhost:8080/login">Haz click en éste enlace para iniciar sesión</a>
    </div>`;

    const emailData = await transport.sendMail({
      from: "Backend ecommerce de Gustavo",
      to: user.email,
      subject: "Usuario registrado exitosamente!",
      html: emailTemplate,
    });
    console.log("contenido", emailData);
    return { status: "success", message: "Registro y envío de correo exitoso" };
  } catch (error) {
    console.log(error.message);
    return { status: "error", message: "Hubo un error al registrar al usuario" };
  }
};

export const smsUserController = async (req, res) => {
  try {
    const message = await twilioClient.messages.create({
      body: "Compra realizada con éxito!",
      from: twilioPhone,
      to: testPhoneNumber, // test
    });
    console.log("message:", message);
    res.json({ status: "success", message: "Compra realizada y envío de sms exitoso" });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", message: "Hubo un error al realizar la compra" });
  }
};

export const uploaderDocsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUser(userId);
    if (user) {
      console.log(req.files);
      const identificacion = req.files["identificacion"]?.[0] || null;
      const domicilio = req.files["domicilio"]?.[0] || null;
      const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
      const docs = [];
      if (identificacion) {
        docs.push({ name: "identificacion", reference: identificacion.filename });
      }
      if (domicilio) {
        docs.push({ name: "domicilio", reference: domicilio.filename });
      }
      if (estadoDeCuenta) {
        docs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename });
      }
      if (docs.length === 3) {
        user.status = "completo";
      } else {
        user.status = "incompleto";
      }
      user.documents = docs;
      await userService.updateUser(user.id, user);
      req.logger.info("Se cargaron los documentos correctamente");
      res.status(200).send(`Se cargaron los documentos correctamente, <a href="/products">Ir a productos</a>`);
    } else {
      res.json({ status: "error", message: "No se pueden cargar los documentos" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", message: "Hubo un error al cargar los documentos" });
  }
};

export const deleteInactiveUsersController = async (req, res) => {
  try {
    // Obtener la fecha actual y la fecha hace 2 días
    const currentDate = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    console.log("Current Date:", currentDate);
    console.log("Two Days Ago:", twoDaysAgo);

    // Obtiene todos los usuarios
    const allUsers = await userService.getUsers();

    // Filtra los usuarios inactivos que no hayan tenido conexión en los últimos 2 días
    const inactiveUsers = allUsers.filter((user) => new Date(user.last_connection) < twoDaysAgo);
    console.log("Inactive Users:", inactiveUsers);

    // Elimina a los usuarios inactivos
    for (const user of inactiveUsers) {
      console.log("Deleting user:", user);

      await userService.deleteUser(user.id);

      console.log("User deleted:", user);

      const emailTemplate = `<div>
        <h1>Hola ${user.first_name}!!</h1>
        <p>Tu cuenta ha sido eliminada debido a la falta de actividad. Si deseas volver a utilizar nuestros servicios, por favor registrate nuevamente.</p>
        <a href="http://localhost:8080/signup">Haz click en éste enlace para volver a registrarte</a>
        </div>`;
      // Envia correo electrónico de notificación al usuario eliminado
      const emailData = await transport.sendMail({
        from: "Backend ecommerce de Gustavo",
        to: user.email,
        subject: "Eliminación de cuenta por inactividad",
        html: emailTemplate,
      });
      console.log("Correo enviado:", emailData);
    }

    res.json({ status: "success", message: "Usuarios inactivos eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuarios inactivos", error);
    res.status(500).json({ status: "error", message: "Hubo un error al eliminar usuarios inactivos" });
  }
};
