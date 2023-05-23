import { options } from "../config/config.js";
import { connectDB } from "../config/dbConnection.js";
import { ProductManagerMongo } from "./db-managers/product.manager.js";
import { CartManagerMongo } from "./db-managers/cart.manager.js";
import { ProductManagerMemory } from "./file-managers/product.manager.js";
import { CartManagerMemory } from "./file-managers/cart.manager.js";

let persistence = options.server.persistence;

let ProductManager, CartManager;

switch (persistence) {
  case "mongo":
    connectDB();
    ProductManager = new ProductManagerMongo();
    CartManager = new CartManagerMongo();
    break;
  case "memory":
    ProductManager = new ProductManagerMemory();
    CartManager = new CartManagerMemory();
    break;
}

export { ProductManager, CartManager };










// import { options } from "../config/config.js";

// let persistence = options.server.persistence;

// let ProductManager, CartManager;

// switch (persistence) {
//   case "mongo":
//     const {connectDB} = await import("../config/dbConnection.js");
//     connectDB();

//     const {ProductManagerMongo} = await import("./db-managers/product.manager.js");
//     ProductManager = new ProductManagerMongo();

//     const {CartManagerMongo} = await import("./db-managers/cart.manager.js");
//     CartManager = new CartManagerMongo();

//     break;
//   case "memory":
//     const {ProductManagerMemory} = await import("./file-managers/product.manager.js");
//     ProductManager = new ProductManagerMemory();

//     const {CartManagerMemory} = await import("./file-managers/cart.manager.js");
//     CartManager = new CartManagerMemory();
//     break;
// };

// export { ProductManager, CartManager };


// import FileCartManager from "./file-managers/cart.manager.js";
// import FileProductManager from "./file-managers/product.manager.js";

// import DbCartManager from "./db-managers/cart.manager.js";
// import DbProductManager from "./db-managers/product.manager.js";

// const config = {
//   persistenceType: "db",
// };

// let CartManager, ProductManager;

// if (config.persistenceType === "db") {
//   CartManager = DbCartManager;
//   ProductManager = DbProductManager;
// } else if (config.persistenceType === "file") {
//   CartManager = FileCartManager;
//   ProductManager = FileProductManager;
// } else {
//   throw new Error("Unknow persistence type");
// }

// export { CartManager, ProductManager };
