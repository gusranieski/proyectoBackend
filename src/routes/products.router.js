import { Router, json } from "express";
import ProductManager from "../managers/ProductManager.js";

const productsRouter = Router();
productsRouter.use(json());

const manager = new ProductManager();

productsRouter.get("/", async(req, res) => {
    const products = await manager.getProducts();
    const {limit} = req.query
    
        if (limit){
            products.length = limit
            return res.send(products)
        } 
    res.send(products);
});

productsRouter.get("/:id", async(req, res) => {
    const id = req.params.id;
    const product = await manager.getProductById(parseInt(id));

    if (!product) {
        return res
        .status(404)
        .send({error:`No existe el producto con id: ${req.params.id}`});
    }

    res.send(product);
});

productsRouter.post("/", async(req, res) => {
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    const newProduct = await manager.addProduct(title, description, code, parseInt(price), parseInt(stock), category, thumbnails, status);

    if (!newProduct) {
    res.status(400).send({ error: 'Error al agregar el producto' });
    return;
    }
    req.io.emit("new-product", req.body)
    res.status(201).send(newProduct);
});

productsRouter.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    const updatedProduct = await manager.updateProduct(id, { title, description, code, price: parseInt(price), stock: parseInt(stock), category, thumbnails, status });

    if (!updatedProduct) {
    return res
        .status(404)
        .send({ error: `No existe el producto con id: ${id}` });
    }
    res.send(updatedProduct);
});

productsRouter.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deletedProduct = await manager.deleteProduct(id);

    if (!deletedProduct) {
    return res
        .status(404)
        .send({ error: `No existe el producto con id: ${id}` });
    }

    res.send({ message: `Producto con id ${id} eliminado correctamente` });
});

export default productsRouter;
