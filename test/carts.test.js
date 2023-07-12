import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";
import cartModel from "../src/dao/models/cart.model.js";
import { productIdTest } from "./products.test.js";

const expect = chai.expect;
const requester = supertest(app);
let cartIdTest;

describe("Testing de carts", () => {
    before(async function () {
      this.timeout(5000);
      await cartModel.deleteMany({});
    });

  describe("POST /carts", () => {
    it("Debería crear un nuevo carrito correctamente", async function () {
      const newCart = {
        products: [],
      };

      const response = await requester.post("/api/carts").send(newCart);
      cartIdTest = response.body.payload._id; // Almacena el ID del producto creado para utilizarlo en otras pruebas

      expect(response.statusCode).to.be.equal(201);
      expect(response.body.status).to.be.equal("success");
      expect(response.body.payload).to.haveOwnProperty("_id");
    });

    it("Debería dar error 401 si el admin quiere agregar un producto a un carrito", async function () {
      const response = await requester.post(`/api/carts/${cartIdTest}/product/${productIdTest}`);

      expect(response.statusCode).to.be.equal(401);
      expect(response.body.status).to.be.equal("error");
    });
  });

  describe("GET /carts", () => {
    it("Debería obtener todos los carritos correctamente", async function () {
      const response = await requester.get("/api/carts");

      expect(response.statusCode).to.be.equal(200);
      expect(response.body.status).to.be.equal("success");
      expect(response.body.payload).to.be.an("array");
      expect(Array.isArray(response.body.payload)).to.deep.equal(true);
    });

    it("Debería devolver el carrito buscado por ID correctamente", async function () {
      const response = await requester.get(`/api/carts/${cartIdTest}`);

      expect(response.statusCode).to.be.equal(200);
      expect(response.body.payload._id).to.be.equal(cartIdTest);
      expect(response.body.status).to.be.equal("success");
      expect(response.body.payload).to.be.ok;
    });

    it("Debería devolver un error 404 si el carrito buscado por ID no existe", async function () {
      const cartIdTest = "64829875b6db6f65712560e1";
      const response = await requester.get(`/api/carts/${cartIdTest}`);

      expect(response.statusCode).to.be.equal(404);
      expect(response.body.status).to.be.equal("error");
    });
  });
});
