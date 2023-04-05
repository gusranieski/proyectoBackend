import { Router, json } from "express";
import { ProductManager } from "../dao/index.js";
import productModel from "../dao/models/product.model.js";

const productsRouter = Router();
productsRouter.use(json());

const manager = new ProductManager();

productsRouter.get("/", async(req, res) => {
    const { limit = 10, lean = true, page = 1, title, sort } = req.query;
    const filter = title ? { title: { $regex: title, $options: "i" } } : {};
    const options = { 
      limit, 
      lean, 
      page,
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},  
    };
    const paginatedProducts = await productModel.paginate( filter, options );
    
    res.status(200).send({ status: "ok", payload: paginatedProducts });
});

productsRouter.get("/:id", async(req, res) => {
    const { id } = req.params;
    const product = await manager.getProductById(id);

    if (!product) {
        return res
        .status(404)
        .send({error:`No existe el producto con id: ${req.params.id}`});
    }

    res.send(product);
});

productsRouter.post("/", async(req, res) => {
    const { title, description, code, price, stock, category, thumbnail, status } = req.body;

    const newProduct = await manager.addProduct(title, description, code, parseInt(price), parseInt(stock), category, thumbnail, status);

    if (!newProduct) {
    res.status(400).send({ error: 'Error al agregar el producto' });
    return;
    }
    req.io.emit("new-product", newProduct);
    res.status(201).send(newProduct);
});

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, stock, category, thumbnail, status } = req.body;

    const updatedProduct = await manager.updateProduct(id, { title, description, code, price: parseInt(price), stock: parseInt(stock), category, thumbnail, status });

    if (!updatedProduct) {
    return res
        .status(404)
        .send({ error: `No existe el producto con id: ${id}` });
    }
    res.send(updatedProduct);
});

productsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await manager.deleteProduct(id);

    if (!deletedProduct) {
    return res
        .status(404)
        .send({ error: `No existe el producto con id: ${id}` });
    }
    req.io.emit("delete-product", deletedProduct);
    res.send({ message: `Producto con id ${id} eliminado correctamente`, products: deletedProduct });
});

export default productsRouter;
