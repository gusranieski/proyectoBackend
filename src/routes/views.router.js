import { Router } from "express";
import { ProductManager } from "../dao/index.js";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js";

const viewsRouter = Router();

const manager = new ProductManager();

// vista home
viewsRouter.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

// vista real-time-products
viewsRouter.get("/real-time-products", async (req, res) => {
  const products = await manager.getProducts();
  res.render("real_time_products", { products });
});

// vista products
viewsRouter.get("/products", async(req, res) => {
  const { limit = 5, lean = true, page = 1 } = req.query;
  const options = { 
    limit, 
    lean, 
    page,
  };

  const paginatedProducts = await productModel.paginate( {}, options );
  
  res.render("products", { paginatedProducts });
});

// vista carts
viewsRouter.get("/carts/:cid", async(req, res) => {
  const { limit = 1, lean = true } = req.query;
  const options = { 
    limit, 
    lean, 
  };

  const paginatedCarts = await cartModel.paginate( {}, options );
  
  res.render("carts", { paginatedCarts });
});

export default viewsRouter;
