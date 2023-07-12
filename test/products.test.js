import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";
import productModel from "../src/dao/models/product.model.js";
import { cookie } from "./users.test.js";

const expect = chai.expect;
const requester = supertest(app);
let productIdTest; // Variable para almacenar el ID del producto creado

describe("Testing de products", () => {
  before(async function () {
    this.timeout(5000);
    await productModel.deleteMany({});
  });
  describe("POST /products", () => {
    it("Debería crear un nuevo producto correctamente", async function () {
      const newProduct = {
        title: "Producto 1",
        description: "Este es un nuevo producto",
        code: "código 1",
        price: 1000,
        stock: 100,
        category: "Categoría 1",
        status: "true",
      };

      const response = await requester.post("/api/products").send(newProduct).set("Cookie", `${cookie.name}=${cookie.value}`);
      productIdTest = response.body.payload._id; // Almacena el ID del producto creado para utilizarlo en otras pruebas

      expect(response.statusCode).to.be.equal(201);
      expect(response.body.payload).to.be.an("object");
      expect(response.body.payload).to.haveOwnProperty("_id");
      expect(response.body.payload.title).to.equal(newProduct.title);
      expect(response.body.payload.description).to.equal(newProduct.description);
      expect(response.body.payload.code).to.equal(newProduct.code);
      expect(response.body.payload.price).to.equal(newProduct.price);
      expect(response.body.payload.stock).to.equal(newProduct.stock);
      expect(response.body.payload.category).to.equal(newProduct.category);
      expect(Array.isArray(response.body.payload.thumbnail)).to.deep.equal(true);
    });

    it("Debería dar error 500 si un campo title no se completa", async function () {
      const newProduct = {
        description: "Este es un nuevo producto",
        code: "código 1",
        price: 1000,
        stock: 100,
        category: "Categoría 1",
        status: "true",
      };

      const response = await requester.post("/api/products").send(newProduct).set("Cookie", `${cookie.name}=${cookie.value}`);

      expect(response.statusCode).to.be.equal(500);
      expect(response.body.status).to.be.equal("error");
      expect(response.body.message).to.be.equal("Error al crear el producto");
    });
  });

  describe("GET /products", () => {
    it("Debería obtener todos los productos correctamente", async function() {
      const response = await requester.get("/api/products");

      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.haveOwnProperty("status");
      expect(Array.isArray(response.body.payload.docs)).to.deep.equal(true);
    });

    it("Debería obtener el detalle de un producto por ID correctamente", async function() {
      const response = await requester.get(`/api/products/${productIdTest}`);
      expect(response.statusCode).to.be.equal(200);
      expect(response.body._id).to.be.equal(productIdTest);
    });
  });
});

export { productIdTest };
