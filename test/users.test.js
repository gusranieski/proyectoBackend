import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";
import userModel from "../src/dao/models/user.model.js";

const expect = chai.expect;
const requester = supertest(app);
let cookie;

describe("Testing de users", () => {
  before(async function () {
    this.timeout(5000);
    await userModel.deleteMany({});
  });

  describe("POST /users", () => {
    it("Debería crear un nuevo usuario correctamente y redirige a /products", async function () {
      const newUser = {
        first_name: "nombre",
        last_name: "apellido",
        age: "30",
        email:"adminCoder@coder.com",
        password:"adminCod3r123",
      };

      const response = await requester.post("/api/sessions/signup").send(newUser);

      expect(response.statusCode).to.be.equal(302);
      expect(response.redirect).to.be.equal(true);
      expect(response.headers).to.have.property("location").that.equals("/products");
    });

    it("Debería retornar un error al intentar registrar un usuario existente y redirige a /api/sessions/failure-signup", async function () {
      const newUser = {
        first_name: "nombre",
        last_name: "apellido",
        age: "30",
        email:"adminCoder@coder.com",
        password:"adminCod3r123",
      };

      const response = await requester.post("/api/sessions/signup").send(newUser);

      expect(response.statusCode).to.be.equal(302);
      expect(response.redirect).to.be.equal(true);
      expect(response.headers).to.have.property("location").that.equals("/api/sessions/failure-signup");
    });

    it("Debería retornar un error al intentar crear un usuario sin completar todos los campos", async function () {
      const newUser = {
        email:"adminCoder@coder.com",
        password:"adminCod3r123",
      };

      const response = await requester.post("/api/sessions/signup").send(newUser);

      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.haveOwnProperty("status");
      expect(response.body.message).to.be.equal("Error creando el usuario");
    });
  });

  describe("POST /login", () => {
    it("Debería iniciar sesión correctamente y establecer la cookie", async function() {
      const credentials = {
        email:"adminCoder@coder.com",
        password:"adminCod3r123",
      };
  
      const response = await requester.post("/api/sessions/login").send(credentials);

      expect(response.statusCode).to.be.equal(302);
      expect(response.redirect).to.be.equal(true);
      expect(response.headers).to.have.property("set-cookie");
  
      // Extrae la cookie del encabezado de respuesta
      const cookieResult = response.headers["set-cookie"][0];
      const cookieData = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
      }
      cookie = cookieData;
      expect(cookieData.name).to.be.ok.and.equal("connect.sid");
      expect(cookieData.value).to.be.ok;
    });
  });

  describe("POST /logout", () => {
    it("Debería devolver un error al intentar cerrar la sesión sin haber iniciado sesión previamente", async function () {
      const response = await requester.post("/api/sessions/logout");
      
      expect(response.statusCode).to.be.equal(401);
      expect(response.body).to.haveOwnProperty("message").that.equals("No se ha iniciado sesión");
    });
  });
});
    
export { cookie };
