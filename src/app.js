import express from "express";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializedPassport } from "./config/passport.config.js";
import { options } from "./config/config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { addLogger } from "./loggers/logger.js";
import { swaggerSpecs } from "./config/docConfig.js";
import swaggerUI from "swagger-ui-express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import authRouter from "./routes/auth.router.js";
import usersRouter from "./routes/users.router.js";
import mocksProductsRouter from "./routes/mock.products.router.js";
import loggerRouter from "./routes/logger.router.js";
import forgotRouter from "./routes/forgot.router.js";
import resetRouter from "./routes/reset.router.js";
import adminRouter from "./routes/admin.router.js";

const app = express();

// Variables de entorno
const mongoUrl = options.mongo.url;
const mongoSecret = options.server.secretSession;
const port = options.server.port || 8080;

// Configuración de la session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoUrl,
      ttl: 1200,
    }),
    secret: mongoSecret,
    resave: true,
    saveUninitialized: true,
  })
);

// Configuración de passport
initializedPassport();
app.use(passport.initialize());
app.use(passport.session());

// Configuración express
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Configuración de socket.io
const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected!");

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.emit("message", "Message sent from server!");
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Swagger
app.use("/api/docs",swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Winston Logger
app.use(addLogger);
app.use("/loggertest", loggerRouter);

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/users", usersRouter);
app.use("/mockingproducts", mocksProductsRouter);
app.use(errorHandler);
app.use("/api/sessions", forgotRouter);
app.use("/api/sessions", resetRouter);
app.use("/api/admin", adminRouter)

export {app};