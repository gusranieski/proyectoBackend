import FileCartManager from "./file-managers/cart.manager.js";
import FileProductManager from "./file-managers/product.manager.js";

import DbCartManager from "./db-managers/cart.manager.js";
import DbProductManager from "./db-managers/product.manager.js";

const config = {
  persistenceType: "db",
};

let CartManager, ProductManager;

if (config.persistenceType === "db") {
  CartManager = DbCartManager;
  ProductManager = DbProductManager;
} else if (config.persistenceType === "file") {
  CartManager = FileCartManager;
  ProductManager = FileProductManager;
} else {
  throw new Error("Unknow persistence type");
}

export { CartManager, ProductManager };
