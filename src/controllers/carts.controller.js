// import { CartManager } from "../dao/index.js";
import { CartManager } from "../dao/factory.js";
import { CustomError } from "../services/customError.js";
import { EError } from "../enums/EError.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { generateProductErrorParam } from "../services/productError.js";
import { generateCartErrorParam } from "../services/cartError.js";

// const manager = new CartManager();

export const cartsController = {

  async getCarts(req, res) {
    try {
      const carts = await CartManager.getCarts();
      res.send(carts);
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Error al obtener los carritos" });
    }
  },


  async addCart(req, res) {
    try {
      const products = req.body;
      const newCart = await CartManager.addCart(products);
      res.status(201).json(newCart);
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  },


  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      if (Number.isNaN(parseInt(cartId))) {
        CustomError.createError({
          name: "Cart param error",
          cause: generateCartErrorParam(req.params.cid),
          message: "Error al encontrar el carrito - Id incorrecto",
          errorCode: EError.INVALID_PARAM,
        });
      }
  
      const cart = await CartManager.getCartById(cartId);
      if (!cart) {
        req.logger.warning(`No existe el carrito con id: ${req.params.cid}`);
        return res.status(404).send({ error: `No existe el carrito con id: ${req.params.cid}` });
      }
      
      res.send(cart);
    } catch (error) {
      req.logger.error(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },
  

  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.id;
      const quantity = parseInt(req.body.quantity);

      if(Number.isNaN(parseInt(cartId))){
          CustomError.createError({
              name:"Cart param error",
              cause:generateCartErrorParam(req.params.cid),
              message:"Error al encontrar el carrito - Id incorrecto",
              errorCode:EError.INVALID_PARAM
          });
      };
      if(Number.isNaN(parseInt(productId))){
          CustomError.createError({
              name:"Product id error",
              cause:generateProductErrorParam(req.params.id),
              message:"Error al encontrar el producto - Id incorrecto",
              errorCode:EError.INVALID_PARAM
          });
      };

      const cart = await CartManager.addProductToCart(cartId, productId, quantity);

      return res.status(200).json(cart);
    } catch (error) {
      req.logger.error(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },

  async removeProductFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.id;
      const quantity = parseInt(req.body.quantity);

      if(Number.isNaN(parseInt(cartId))){
        CustomError.createError({
            name:"Cart param error",
            cause:generateCartErrorParam(req.params.cid),
            message:"Error al encontrar el carrito - Id incorrecto",
            errorCode:EError.INVALID_PARAM
        });
    };
    if(Number.isNaN(parseInt(productId))){
        CustomError.createError({
            name:"Product id error",
            cause:generateProductErrorParam(req.params.id),
            message:"Error al encontrar el producto - Id incorrecto",
            errorCode:EError.INVALID_PARAM
        });
    };

      const updatedCart = await CartManager.removeProductFromCart(
        cartId,
        productId,
        quantity
      );
      res.status(200).send({ status: "ok", payload: updatedCart });
    } catch (error) {
      req.logger.error(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },

  async updateCart(req, res) {
    try {
      const cartId = req.params.cid;
      const products = req.body;

      if(Number.isNaN(parseInt(cartId))){
        CustomError.createError({
            name:"Cart param error",
            cause:generateCartErrorParam(req.params.cid),
            message:"Error al encontrar el carrito - Id incorrecto",
            errorCode:EError.INVALID_PARAM
        });
    };

      const updatedCart = await CartManager.updateCart(cartId, products);

      return res.status(200).json(updatedCart);
    } catch (error) {
      req.logger.error(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },

  async updateCartItemQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.id;
      const quantity = parseInt(req.body.quantity);

      if(Number.isNaN(parseInt(cartId))){
        CustomError.createError({
            name:"Cart param error",
            cause:generateCartErrorParam(req.params.cid),
            message:"Error al encontrar el carrito - Id incorrecto",
            errorCode:EError.INVALID_PARAM
        });
    };
    if(Number.isNaN(parseInt(productId))){
        CustomError.createError({
            name:"Product id error",
            cause:generateProductErrorParam(req.params.id),
            message:"Error al encontrar el producto - Id incorrecto",
            errorCode:EError.INVALID_PARAM
        });
    };

      const updatedCart = await CartManager.updateCartItemQuantity(
        cartId,
        productId,
        quantity
      );

      return res.status(200).json(updatedCart);
    } catch (error) {
      req.logger.error(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },

  async deleteCart(req, res) {
    try {
      const cartId = req.params.cid;
      if (Number.isNaN(parseInt(cartId))) {
        CustomError.createError({
          name: "Cart param error",
          cause: generateCartErrorParam(req.params.cid),
          message: "Error al encontrar el carrito - Id incorrecto",
          errorCode: EError.INVALID_PARAM,
        });
      }
  
      const deletedCart = await CartManager.deleteCart(cartId);
      if (!deletedCart) {
        req.logger.warning(`No existe el carrito con id: ${req.params.cid}`);
        return res.status(404).send({ error: `No existe el carrito con id: ${cartId}` });
      }
      
      res.send({
        message: `Carrito con id ${cartId} eliminado correctamente`,
        carts: deletedCart,
      });
    } catch (error) {
      req.logger.fatal(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },
  

  async getPurchase(req, res) {
    try {
      const { cid } = req.params;

      const cartId = req.params.cid;
      if (Number.isNaN(parseInt(cartId))) {
        CustomError.createError({
          name: "Cart param error",
          cause: generateCartErrorParam(req.params.cid),
          message: "Error al encontrar el carrito - Id incorrecto",
          errorCode: EError.INVALID_PARAM,
        });
      };
      const cart = await CartManager.getCartById(cid);

      if (cart) {
        const purchaseResult = await CartManager.getTicket(cart, req.user.email);

        res.send(purchaseResult);
      } else {
        res.send("El carrito no se encuentra");
      }
    } catch (error) {
      res.status(500);
      errorHandler(error, req, res);
    }
  },
};
