// import { CartManager } from "../dao/index.js";
import { ProductManager } from "../dao/factory.js";
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
      req.logger.info("Listado de carritos obtenidos");
      res.status(200).send({ status:"success", payload:carts });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Error al obtener los carritos" });
    }
  },


  async addCart(req, res) {
    try {
      const products = req.body;
      const newCart = await CartManager.addCart(products);
      req.logger.info("Nuevo carrito creado");
      res.status(201).send({ status:"success", payload:newCart });
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
        return res.status(404).send({ status:"error", message: `No existe el carrito con id: ${req.params.cid}` });
      }

      req.logger.info(`Carrito con id: ${req.params.cid} existente`);
      res.status(200).send({ status:"success", payload:cart });
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

      // Verificar si el usuario está autenticado
      if (!req.user) {
        req.logger.warning("no se inició sesión para agregar un producto al carrito")
        return res.json({ status: "error", message: "Debes iniciar sesión para agregar un producto al carrito" });
      }

      const product = await ProductManager.getProductById(productId);

      const productOwner = product.owner.toString();
      const userId = req.user._id.toString();
  
      if (req.user.role === "premium" && productOwner === userId) {
        return res.json({ status:"error", message:"no se puede agregar al carrrito un producto que creaste" });
      }

      const cart = await CartManager.addProductToCart(cartId, productId, quantity);
      req.logger.info(`Producto con ID:${productId} agregado al carrito ID:${cartId}`);
      
      return res.status(200).redirect("/carts/:cid");

      // return res.status(200).send({ status:"success", payload:cart });
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

      req.logger.info(`Producto con ID:${productId} eliminado del carrito ID:${cartId}`)
      res.status(200).send({ status:"success", payload:updatedCart });
    } catch (error) {
      req.logger.error(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },

  // Método para actualizar el carrito con un nuevo array de productos
  async updateCartWithProducts(req, res) {
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

      req.logger.info("carrito actualizado");
      return res.status(200).send({ status:"success", payload:updatedCart });
    } catch (error) {
      req.logger.error(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },

  // Método para vaciar el carrito del usuario
  async emptyCart(req, res) {
    try {
      const cartId = req.params.cid;
      const products = []; 

      if (Number.isNaN(parseInt(cartId))) {
        CustomError.createError({
          name: "Cart param error",
          cause: generateCartErrorParam(req.params.cid),
          message: "Error al encontrar el carrito - Id incorrecto",
          errorCode: EError.INVALID_PARAM,
        });
      }

      const updatedCart = await CartManager.emptyCart(req, cartId, products);
      req.logger.info("Carrito vaciado");
      return res.status(200).send({ status: "success", payload: updatedCart });
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

      // Obtener el producto específico del carrito utilizando su ID
      const product = await ProductManager.getProductById(productId);

      if (product.stock === 0) {
        return res.status(400).json(`El producto ${product.title} está agotado, no hay más stock disponible`);
      }

      const updatedCart = await CartManager.updateCartItemQuantity(
        cartId,
        productId,
        quantity
      );
      
      req.logger.info(`Cantidad del producto con ID:${productId} actualizada:${quantity}`)
      return res.status(200).send({ status:"success", payload:updatedCart });
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
      req.logger.info(`Carrito ID: ${cartId} eliminado`);
      res.status(200).send({ status: "success", message: "carrito eliminado", payload: deletedCart });
    } catch (error) {
      req.logger.fatal(error);
      res.status(500);
      errorHandler(error, req, res);
    }
  },
  
  async getPurchase(req, res) {
    try {
      const { cid } = req.params;
      const cart = await CartManager.getCartById(cid);
  
      if (!cart) {
        return res.send("El carrito no se encuentra");
      }
  
      // Verifica si la cantidad solicitada es mayor que el stock disponible
      for (const product of cart.products) {
        const productDB = await ProductManager.getProductById(product.idProduct);
        if (product.quantity > productDB.stock) {
          req.logger.warning(`No hay suficiente stock para el producto: ${product.idProduct.title}`);
          return res.status(400).send(`No hay suficiente stock para el producto: ${product.idProduct.title}`);
        }
      }
  
      const purchaseResult = await CartManager.getTicket(cart, req.user.email);
      const ticketId = purchaseResult.ticket._id;
      req.logger.info("Compra realizada exitósamente");
      res.status(200).redirect(`/purchase/${ticketId}`);
    } catch (error) {
      res.status(500);
      errorHandler(error, req, res);
    }
  },
  // Obtiene el ID del ticket desde los parámetros de la URL
  async showTicket(req, res) {
    try {
      const ticketId = req.params.ticketId; 
      const ticketResult = await CartManager.getTicketById(ticketId);

      if (!ticketResult) {
        return res.status(404).json({ error: "El ticket no se encuentra" });
      }
      res.status(200).send({ status:"success", payload: ticketResult });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Error al obtener el ticket" });
    }
  },
};
