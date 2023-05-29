import { createNewProduct } from "../utils.js";

export const createMockProducts = async (req, res) => {
  try {
    const cant = parseInt(req.query.cant) || 100;
    let products = [];
    for (let i = 0; i < cant; i++) {
      const product = createNewProduct();
      products.push(product);
    }
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send("error");
  }
};
