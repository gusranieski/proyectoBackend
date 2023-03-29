// import fs from "fs";

// class CartManager {
//   static id = 0;
//   #path;

//   constructor(path = "./src/data/carts.json") {
//     this.#path = path;
//   }

//   // OBTIENE EL ARRAY DE CARTS
//   async getCarts() {
//     try {
//       const carts = await fs.promises.readFile(this.#path, "utf-8");
//       return JSON.parse(carts);
//     } catch (error) {
//       return [];
//     }
//   }

//   // AGREGA UN NUEVO CARRITO
//   async addCart() {
//     try {
//       let carts = await this.getCarts();

//       // Actualizar el ID del carrito
//       CartManager.id = carts.reduce((maxId, cart) => {
//           return cart.id > maxId ? cart.id : maxId;
//         }, 0) + 1;

//       const newCart = {
//         id: CartManager.id,
//         products: [],
//       };

//       carts = [...carts, newCart];

//       await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
//       return newCart;
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // OBTIENE UN CARRITO POR ID
//   async getCartById(id) {
//     const carts = await this.getCarts();
//     let cartSearch = carts.find((c) => c.id === id);

//     if (cartSearch == undefined) {
//       console.log("Not Found");
//     } else {
//       return cartSearch;
//     }
//   }

//   // AGREGA UN PRODUCTO AL CARRITO
//   async addProductToCart(cartId, productId, quantity) {
//     try {
//       if (!cartId) {
//         console.log("Error: cartId not found");
//         return;
//       }

//       const carts = await this.getCarts();

//       const cartIndex = carts.findIndex((c) => c.id === cartId);
//       const cart = carts[cartIndex];

//       if (!cart) {
//         console.log(`Error: cart with id ${cartId} not found`);
//         return;
//       }

//       const productIndex = cart.products.findIndex((p) => p.id === productId);
//       if (productIndex >= 0) {
//         cart.products[productIndex].quantity += quantity;
//       } else {
//         cart.products = [...cart.products, { id: productId, quantity: 1 }];
//       }

//       carts[cartIndex] = cart;

//       await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
//       return cart;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

// export default CartManager;
