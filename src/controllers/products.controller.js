// import { ProductManager } from "../dao/index.js";
import { ProductManager } from "../dao/factory.js";
import productModel from "../dao/models/product.model.js";

// const manager = new ProductManager();

export const productsController = {
  async getAllProducts(req, res) {
    const { limit = 10, lean = true, page = 1, title, sort } = req.query;
    const filter = title ? { title: { $regex: title, $options: "i" } } : {};
    const options = {
      limit,
      lean,
      page,
      sort:
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
    };
    const paginatedProducts = await productModel.paginate(filter, options);

    res.status(200).send({ status: "ok", payload: paginatedProducts });
  },

  async getProductById(req, res) {
    const { id } = req.params;
    const product = await ProductManager.getProductById(id);

    if (!product) {
        return res
        .status(404)
        .send({error:`No existe el producto con id: ${req.params.id}`});
    }

    res.send(product);
  },

  async addProduct(req, res) {
    const { title, description, code, price, stock, category, thumbnail, status } = req.body;

    const newProduct = await ProductManager.addProduct(title, description, code, parseInt(price), parseInt(stock), category, thumbnail, status);

    if (!newProduct) {
    res.status(400).send({ error: 'Error al agregar el producto' });
    return;
    }
    req.io.emit("new-product", newProduct);
    res.status(201).send(newProduct);
  },

  async updateProduct(req, res) {
    const { id } = req.params;
    const { title, description, code, price, stock, category, thumbnail, status } = req.body;

    const updatedProduct = await ProductManager.updateProduct(id, { title, description, code, price: parseInt(price), stock: parseInt(stock), category, thumbnail, status });

    if (!updatedProduct) {
    return res
        .status(404)
        .send({ error: `No existe el producto con id: ${id}` });
    }
    res.send(updatedProduct);
  },

  async deleteProduct(req, res) {
    const { id } = req.params;
    const deletedProduct = await ProductManager.deleteProduct(id);

    if (!deletedProduct) {
    return res
        .status(404)
        .send({ error: `No existe el producto con id: ${id}` });
    }
    req.io.emit("delete-product", deletedProduct);
    res.send({ message: `Producto con id ${id} eliminado correctamente`, products: deletedProduct });
  },
};
