import productModel from "../models/product.model.js";

class ProductManager {
  constructor() {}

  async getProducts() {
    const products = await productModel.find().lean();
    return products;
  }

  async addProducts(title, description, price, thumbnail, code, stock) {
    let newProduct = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    return newProduct;
  }

  async getProductById(id) {
    const product = await productModel.find({ _id: id });
    return product;
  }
  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    const filter = { _id: id };
    const update = { title, description, price, thumbnail, code, stock };
    let product = await productModel.findOneAndUpdate(filter, update);

    return product;
  }

  async deleteProduct(id) {
    const productDelete = await productModel.deleteOne({ _id: id });
    return productDelete;
  }
}

export default ProductManager;
