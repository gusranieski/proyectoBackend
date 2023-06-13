import fs from "fs";
import __dirname from "../../utils.js";
import { getNextId } from "./utils.js";

const path = __dirname + "/dao/file-managers/files/products.json";

export class ProductManagerMemory {
  #path;

  constructor() {
    this.#path = path;
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

  // AGREGA LOS PRODUCTOS
  async addProduct(title, description, code, price, stock, category, thumbnail=[]) {
    try {
      const products = await this.getProducts();

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
      throw error;
    }
  }

  // OBTIENE UN PRODUCTO POR ID
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const search = products.find((p) => p.id === parseInt(id));
  
      if (!search) {
        throw new Error("Product not found");
      }
  
      return search;
    } catch (error) {
      throw error;
    }
  }
  
  // ACTUALIZA LOS PRODUCTOS
  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts();
      const productToUpdate = products.find((p) => p.id === parseInt(id));
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
      throw error;
    }
  }
  // ELIMINA LOS PRODUCTOS
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const newArray = products.filter((p) => p.id !== id);
      await fs.promises.writeFile(this.#path, JSON.stringify(newArray, null, 2));
      return newArray;
    } catch (error) {
      throw error;
    }
  }
}
