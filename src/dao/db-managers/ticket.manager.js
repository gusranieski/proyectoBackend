// import { v4 as uuidv4 } from 'uuid';
// import { ticketsModel } from '../models/ticket.model.js';
// import ProductManager from './product.manager.js';

// export default class TicketManager {
//   constructor() {}

// getPurchase = async (cart, userEmail) => {
//     try {
//       const managerProd = new ProductManager();

//       if(!cart.products.length) {
//         return { message: "No tenés productos en tu carrito, agregá algún producto" };
//       }

//       const ticketProducts = [];
//       const rejectedProducts = [];
//       let totalAmount = 0;

//       for(let i=0; i < cart.products.length; i++) {
//         const cartProduct = cart.products[i];
//         const productDB = await managerProd.getProductById(cartProduct.idProduct);

//         if(cartProduct.quantity <= productDB.stock){
//           ticketProducts.push(cartProduct);
//           // Suma al total el precio del producto multiplicado por la cantidad
//           totalAmount += productDB.price * cartProduct.quantity;
//           // Resta la cantidad del carrito al stock de la base de datos
//           const updatedStock = productDB.stock - cartProduct.quantity;
//           productDB.stock = updatedStock;

//           // Actualiza el stock del producto en la base de datos
//           await managerProd.updateProduct(productDB.id, productDB);
//         } else {
//           rejectedProducts.push(cartProduct);
//         }
//       }

//       const newTicket = {
//         code: uuidv4(),
//         purchase_datetime: new Date().toLocaleString(),
//         amount: totalAmount,
//         purchaser: userEmail
//       };
//       const ticketCreated = await ticketsModel.create(newTicket);

//       // Filtra los productos del carrito y guarda solo los que fueron rechazados durante la compra
//       const rejectedProductIds = rejectedProducts.map((product) => product.idProduct);
//       cart.products = cart.products.filter((product) => rejectedProductIds.includes(product.idProduct));
//       await cart.save();

//       // Verifica si hay productos rechazados y envía un mensaje al usuario si es el caso
//       if (rejectedProducts.length > 0) {
//         return { message: "Quedaron algunos productos sin comprar en el carrito.", ticket: ticketCreated };
//       } else {
//         return { message: "Compraste todos los productos del carrito!", ticket: ticketCreated };
//       }
//     } catch (error) {
//       console.error(error);
//       throw new Error("Error al cargar la compra");
//     }
//   }
// }