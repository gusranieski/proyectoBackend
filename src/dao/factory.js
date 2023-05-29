import { options } from "../config/config.js";
import { connectDB } from "../config/dbConnection.js";
import { ProductManagerMongo } from "./db-managers/product.manager.js";
import { CartManagerMongo } from "./db-managers/cart.manager.js";
// import { UserManagerMongo } from "./db-managers/user.manager.js";
import { ProductManagerMemory } from "./file-managers/product.manager.js";
import { CartManagerMemory } from "./file-managers/cart.manager.js";

let persistence = options.server.persistence;

let ProductManager, CartManager, UserManager;

switch (persistence) {
  case "mongo":
    console.log("Using the MongoDB Database");
    connectDB();
    ProductManager = new ProductManagerMongo();
    CartManager = new CartManagerMongo();
    // UserManager = new UserManagerMongo();
    break;
  case "memory":
    console.log("Using the Filesystem Database");
    ProductManager = new ProductManagerMemory();
    CartManager = new CartManagerMemory();
    break;
}

export { ProductManager, CartManager, UserManager };
