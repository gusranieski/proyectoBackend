import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

// Configuración de la session
app.use(session({
  store: MongoStore.create({
    mongoUrl:"mongodb+srv://gustavoranieski:pistachO403613@coder-cluster-db.de6gzxv.mongodb.net/sessions?retryWrites=true&w=majority",
    ttl:30
  }),
  secret:"claveSecreta",
  resave:true,
  saveUninitialized:true
}))

// Configuración de Mongoose
mongoose
  .connect(
    "mongodb+srv://gustavoranieski:pistachO403613@coder-cluster-db.de6gzxv.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then((conn) => {
    console.log("Connected to DB!");
  });

// Configuración express
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Configuración de socket.io
const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
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

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", usersRouter);