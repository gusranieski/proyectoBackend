import fs from "fs";

class ProductManager {
  #path;

  constructor(path = "./src/data/products.json") {
    this.#path = path;
  }

  static id = 0;
  // AGREGA LOS PRODUCTOS
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const products = await this.getProducts();
      ProductManager.id++;

      if (!title || !description || !price || !thumbnail || !code || !stock) {
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
        price,
        thumbnail,
        code,
        stock,
        id: ProductManager.id,
      };
      products.push(newProduct);
      await fs.promises.writeFile(this.#path, JSON.stringify(products));
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
      console.log("Nuevo array sin producto eliminado:", newArray);
    } catch (error) {
      console.error(error);
    }
  }
}

export default ProductManager;

// // // TESTING
// async function main() {
//   const manager = new ProductManager("./src/data/products.json");

//   // Se agregan productos
//   await manager.addProduct(
//     "Mouse Logitech",
//     "Inalámbrico M280 Rojo",
//     6900,
//     "ruta de imágen",
//     "cod01",
//     50
//   );
//   await manager.addProduct(
//     "Auriculares Motorola",
//     "Pulse 120 Blanco",
//     4200,
//     "ruta de imágen",
//     "cod02",
//     50
//   );
//   await manager.addProduct(
//     "Teclado Logitech",
//     "K120",
//     5400,
//     "ruta de imágen",
//     "cod03",
//     50
//   );
//   await manager.addProduct(
//     "Led Samsung",
//     "H200",
//     10000,
//     "ruta de imágen",
//     "cod04",
//     50
//   );
//   await manager.addProduct(
//     "Notebook Dell",
//     "Inspiron 5050",
//     140000,
//     "ruta de imágen",
//     "cod05",
//     50
//   );
//   await manager.addProduct(
//     "Impresora Brother",
//     "DCP",
//     80000,
//     "ruta de imágen",
//     "cod06",
//     50
//   );
//   await manager.addProduct(
//     "Memoria WD",
//     "Elements 2T",
//     15000,
//     "ruta de imágen",
//     "cod07",
//     50
//   );
//   await manager.addProduct(
//     "Notebook Toshiba",
//     "Satellite",
//     120000,
//     "ruta de imágen",
//     "cod08",
//     50
//   );
//   await manager.addProduct(
//     "Teclado Genius",
//     "M220",
//     5000,
//     "ruta de imágen",
//     "cod09",
//     50
//   );
//   await manager.addProduct(
//     "Mouse Genius",
//     "H100",
//     4000,
//     "ruta de imágen",
//     "cod010",
//     50
//   );

// }

// main();