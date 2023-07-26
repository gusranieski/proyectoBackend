import { ProductManager } from "../dao/factory.js";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js";


export const renderHome = async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render("home", { products });
};

export const renderRealTimeProducts = async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render("real_time_products", { products });
};

export const renderProducts = async (req, res) => {
  try {
    const { limit = 5, lean = true, page = 1 } = req.query;
    const options = {
      limit,
      lean,
      page,
    };

    const paginatedProducts = await productModel.paginate({}, options);
    const userData = req.user ? { user: req.user.email, role: req.user.role, cart: req.user.cart._id } : null;
    res.render("products", { paginatedProducts, userData });
  } catch (error) {
    console.log("Error al renderizar los productos");
    res.status(500).send("Hubo un error al renderizar los productos.");
  }
};

export const renderCart = async (req, res) => {
  try {
    const currentCart = await cartModel.findById(req.user.cart._id).lean();
    const userData = req.user ? { user: req.user.email, role: req.user.role, cart: req.user.cart._id } : null;
    res.render("carts", { currentCart, userData });
  } catch (error) {
    console.log("Error al renderizar el carrito");
    res.status(500).send("Hubo un error al renderizar el carrito.");
  }
};

export const renderLogin = (req, res) => {
  res.render("login");
};

export const renderSignup = (req, res) => {
  res.render("signup");
};

export const renderProfile = (req, res) => {
  const userData = req.user ? { user: req.user.email, role: req.user.role, cart: req.user.cart._id, products: req.user.cart.products._id } : null;
  res.render("profile", { userData });
};

export const renderForgotPassword = (req, res) => {
  res.render("forgot");
};

export const renderResetPassword = (req, res) => {
  const token = req.query.token;
  res.render("reset", {token});
};

/* renderiza una cantidad de carritos */

// export const renderCarts = async (req, res) => {
//   const { limit = 1, lean = true } = req.query;
//   const options = {
//     limit,
//     lean,
//   };

//   const paginatedCarts = await cartModel.paginate({}, options);

//   res.render("carts", { paginatedCarts });
// };