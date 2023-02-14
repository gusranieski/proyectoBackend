const fs = require("fs");

class ProductManager {
  #path = "./products.json";

  constructor(path) {
    this.#path = path;
  }

  static id = 0;
  // AGREGA LOS PRODUCTOS
  async addProduct(title, description, price, thumbail, code, stock) {
    try {
      const products = await this.getProducts();
      ProductManager.id++;

      if (!title || !description || !price || !thumbail || !code || !stock) {
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
        thumbail,
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

// TESTING
async function main() {
  const manager = new ProductManager("./products.json");

  // Primer llamada a getProducts
  console.log("Array vacío:", await manager.getProducts());
  // Se agregan productos
  await manager.addProduct(
    "Mouse Logitech",
    "Inalámbrico M280 Rojo",
    6900,
    "ruta de imágen",
    "cod01",
    50
  );
  await manager.addProduct(
    "Auriculares Motorola",
    "Pulse 120 Blanco",
    4200,
    "ruta de imágen",
    "cod02",
    50
  );
  await manager.addProduct(
    "Teclado Logitech",
    "K120",
    5400,
    "ruta de imágen",
    "cod03",
    50
  );

  // Segunda llamada a getProducts
  const productsBefore = await manager.getProducts();
  console.log("Productos antes de actualizar:", productsBefore);

  // Verifica si existe un producto
  const existe = await manager.getProductById(2);
  console.log("Id solicitado:", existe);

  // Actualiza un producto
  await manager.updateProduct(1, { price: 7500 });

  // Verifica que el producto se haya actualizado correctamente
  console.log("Productos después de actualizar:", await manager.getProducts());
  // Obtiene el producto actualizado y lo muestra
  console.log("Producto actualizado:", await manager.getProductById(1));

  // Elimina un producto por Id
  await manager.deleteProduct(3);
}

main();
