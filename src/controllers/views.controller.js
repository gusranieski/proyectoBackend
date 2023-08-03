import { ProductManager, CartManager } from "../dao/factory.js";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js";
import userModel from "../dao/models/user.model.js";
import ticketsModel from "../dao/models/ticket.model.js";

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
  const userData = req.user ? { user: req.user.email } : null; 
  res.render("login", { userData });
};

export const renderSignup = (req, res) => {
  const userData = req.user ? { user: req.user.email } : null; 
  res.render("signup", { userData });
};

export const renderProfile = (req, res) => {
  const userData = req.user ? { user: req.user.email, role: req.user.role, cart: req.user.cart._id, id: req.user._id } : null;
  res.render("profile", { userData });
};

export const renderForgotPassword = (req, res) => {
  res.render("forgot");
};

export const renderResetPassword = (req, res) => {
  const token = req.query.token;
  res.render("reset", {token});
};

export const renderAdminPanel = async (req, res) => {
  try {
    const users = await userModel.find({}, { _id: 1, full_name: 1, email: 1, role: 1 }).lean();
    const userData = req.user; 
    res.render("admin", { users, userData });
  } catch (error) {
    console.log("Error al renderizar la vista de administración", error);
    res.status(500).send("Hubo un error al renderizar la vista de administración.");
  }
};

export const renderPurchase = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await ticketsModel.findById(ticketId).lean();

    if (!ticket) {
      console.log("No se encontraron los detalles del ticket");
      return res.status(404).send("No se encontraron los detalles del ticket.");
    }

    const purchaseData = {
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime.toLocaleString(),
      amount: ticket.amount.toLocaleString(),
      purchaser: ticket.purchaser,
    };

    res.render("purchase", { purchaseData });
  } catch (error) {
    console.log("Error al renderizar la vista de la compra", error);
    res.status(500).send("Hubo un error al renderizar la vista de la compra.");
  }
};
