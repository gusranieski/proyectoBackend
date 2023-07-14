import productModel from "../models/product.model.js";

export class ProductManagerMongo {
  constructor() {}

  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (error) {
      throw error;
    }
  }

  async addProduct(product) {
    try {
      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findById(id);
      return product;
    } catch (error) {
      throw error;
    }
  }
    
  async updateProduct(id, updatedProduct) {
    try {
      const updated = await productModel.findOneAndUpdate(
        { _id: id },
        updatedProduct,
        { new: true }
      );
      return updated;
    } catch (error) {
      throw error;
    }
  }
  
  async deleteProduct(id) {
    try {
      const deleted = await productModel.findByIdAndDelete(id).lean();
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}
