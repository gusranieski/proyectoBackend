// import { ProductManager } from "../dao/index.js";
import { ProductManager } from "../dao/factory.js";
import productModel from "../dao/models/product.model.js";
import { CustomError } from "../services/customError.js";
import { EError } from "../enums/EError.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { generateProductErrorInfo, updateProductErrorInfo, generateProductErrorParam } from "../services/productError.js";

// const manager = new ProductManager();

export const productsController = {
  
  async getAllProducts(req, res) {
    try {
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
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      if(Number.isNaN(productId)){
          CustomError.createError({
              name: "Product ID error",
              cause: generateProductErrorParam(id),
              message: "Error al encontrar el producto",
              errorCode: EError.INVALID_PARAM
          });
      };

      const product = await ProductManager.getProductById(id);
  
      if (!product) {
        req.logger.error(`No existe el producto con id: ${req.params.id}`);
        return res.status(404).send({ error: `No existe el producto con id: ${req.params.id}` });
      }
  
      res.send(product);
    } catch (error) {
      req.logger.error("Error al obtener el producto por ID");
      res.status(500);
      errorHandler(error, req, res);
    }
  },
  

  async addProduct(req, res) {
    try {
      const { title, description, code, price, stock, category, thumbnail, status } = req.body;
      if (!title || !description || !code || !price || !stock) {
        req.logger.warning("campos incompletos o parámetros mal ingresados");
        CustomError.createError({
          name: "Product create error",
          cause: generateProductErrorInfo(req.body),
          message: "Error al crear el producto",
          errorCode: EError.INVALID_JSON
      });
    };
    
    const newProduct = await ProductManager.addProduct(title, description, code, parseInt(price), parseInt(stock), category, thumbnail, status);
    req.logger.info("se creó un nuevo producto");
    if (!newProduct) {
    res.status(400).send({ error: 'Error al agregar el producto' });
    return;
    }
    req.io.emit("new-product", newProduct);
    res.status(201).send({ status: "succes", payload: newProduct });    
    } catch (error) {
      req.logger.error("Error al agregar el producto");
      res.status(500);
      errorHandler(error, req, res);
    }
  },
  
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { title, description, code, price, stock, category, thumbnail, status } = req.body;
      if (!title || !description || !code || !price || !stock) {
        req.logger.error("Campos incompletos o parámetros mal ingresados");
        CustomError.createError({
            name: "Product update error",
            cause: updateProductErrorInfo(req.body),
            message: "Error al actualizar el producto",
            errorCode: EError.INVALID_JSON
        });
      };

      const updatedProduct = await ProductManager.updateProduct(id, { title, description, code, price: parseInt(price), stock: parseInt(stock), category, thumbnail, status });
  
      if (!updatedProduct) {
        return res.status(404).send({ error: `No existe el producto con id: ${id}` });
      }

      res.status(201).send({ status: "succes", payload: updatedProduct });
    } catch (error) {
      req.logger.error("Error al actualizar el producto");
      res.status(500);
      errorHandler(error, req, res);
    }
  },
  

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      if(Number.isNaN(productId)){
          CustomError.createError({
              name: "Product ID error",
              cause: generateProductErrorParam(id),
              message: "Error al encontrar el producto",
              errorCode: EError.INVALID_PARAM
          });
      };

      const deletedProduct = await ProductManager.deleteProduct(id);
  
      if (!deletedProduct) {
        req.logger.warning(`No existe el producto con id: ${id}`);
        return res.status(404).send({ error: `No existe el producto con id: ${id}` });
      }
      
      req.io.emit("delete-product", deletedProduct);
      res.send({ message: `Producto con id ${id} eliminado correctamente`, products: deletedProduct });
    } catch (error) {
      req.logger.error("Error al eliminar el producto");
      res.status(500);
      errorHandler(error, req, res);
    }
  }
  
};
