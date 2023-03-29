import fs from "fs";
import __dirname from "../../utils.js";
import { getNextId } from "./utils.js";

const path = __dirname + "/dao/file-managers/files/products.json";

class ProductManager {
  #path;

  constructor() {
    this.#path = path;
  }

  // AGREGA LOS PRODUCTOS
  async addProduct(title, description, code, price, stock, category, thumbnail=[]) {
    try {
      const products = await this.getProducts();

            // // Actualizar el ID del producto
            // ProductManager.id = products.reduce((maxId, product) => {
            //   return product.id > maxId ? product.id : maxId;
            // }, 0) + 1;

      if (!title || !description || !code || !price || !stock || !category) {
        console.log("Error: Todos los campos son obligatorios");
        return;
      }

      const existingProduct = products.find((product) => product.code === code);

      if (existingProduct) {
        console.log(`Error: Ya existe un producto con el código ${code}`);
        return;
      }

      const newProduct = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
        status: true,
        id: getNextId(products),
      };
      products.push(newProduct);
      await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error(error);
    }
  }
  // OBTIENE LA LISTA DE PRODUCTOS
  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      return [];
    }
  }
  // OBTIENE UN PRODUCTO POR ID
  async getProductById(id) {
    const products = await this.getProducts();
    let search = products.find((p) => p.id === id);

    if (search == undefined) {
      console.log("Not Found");
    } else {
      return search;
    }
  }
  // ACTUALIZA LOS PRODUCTOS
  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts();
      const productToUpdate = products.find((p) => p.id === id);

      if (!productToUpdate) {
        console.log(`Product with id ${id} not found`);
        return;
      }

      const updatedProduct = { ...productToUpdate, ...updatedFields };

      const updatedProducts = products.map((p) =>
        p.id === id ? updatedProduct : p
      );

      await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts, null, 2));
      return updatedProduct;
    } catch (error) {
      console.error(error);
    }
  }
  // ELIMINA LOS PRODUCTOS
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const newArray = products.filter((p) => p.id != id);
      await fs.promises.writeFile(this.#path, JSON.stringify(newArray, null, 2));
      return newArray;
    } catch (error) {
      console.error(error);
    }
  }
}

export default ProductManager;


// import fs from "fs";
// import __dirname from "../../utils.js";
// import { getNextId } from "./utils.js";

// const path = __dirname + "/dao/file-managers/files/products.json";

// export default class ProductManager {
//   constructor() {
//     console.log("Working with products using filesystem");
//   }

//   getAll = async () => {
//     if (fs.existsSync(path)) {
//       const data = await fs.promises.readFile(path, "utf-8");
//       return JSON.parse(data);
//     }
//     return [];
//   };

//   create = async (product) => {
//     const products = await this.getAll();

//     const newProduct = {
//       ...product,
//       id: getNextId(products),
//     };

//     const updatedProducts = [...products, newProduct];

//     await fs.promises.writeFile(path, JSON.stringify(updatedProducts));

//     return newProduct;
//   };
// }
