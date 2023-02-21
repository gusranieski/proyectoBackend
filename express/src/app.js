import express from "express";
import ProductManager from "./ProductManager.js";

const manager = new ProductManager();

const app = express();

app.get("/products", async(req, res) => {
    const products = await manager.getProducts();
    const {limit} = req.query
    
        if (limit){
            products.length = limit
            return res.send(products)
        } 
    res.send(products);
});

app.get("/products/:id", async(req, res) => {
    const id = req.params.id;
    const product = await manager.getProductById(parseInt(id));

    if (!product) {
        return res
        .status(404)
        .send({error:`No existe el producto con id: ${req.params.id}`});
    }

    res.send(product);
  });

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
