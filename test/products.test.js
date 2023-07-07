import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";
import productModel from "../src/dao/models/product.model.js";

const expect = chai.expect;
const requester = supertest(app);

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
        thumbnail: [],
        status: "true",
        owner: "adminCoder@coder.com",
      };

      const response = await requester.post("/api/products").send(newProduct);
      console.log(response);

      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
      expect(response.body.title).to.equal(newProduct.title);
      expect(response.body.description).to.equal(newProduct.description);
      expect(response.body.code).to.equal(newProduct.code);
      expect(response.body.price).to.equal(newProduct.price);
      expect(response.body.stock).to.equal(newProduct.stock);
      expect(response.body.category).to.equal(newProduct.category);
      expect(response.body.thumbnail).to.deep.equal(newProduct.thumbnail);
    });
  });
});
