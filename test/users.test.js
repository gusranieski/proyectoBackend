import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";
import userModel from "../src/dao/models/user.model.js";

const expect = chai.expect;
const requester = supertest(app);

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
        email: "prueba@email.com",
        password: "123",
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
        email: "prueba@email.com",
        password: "123",
      };

      const response = await requester.post("/api/sessions/signup").send(newUser);

      expect(response.statusCode).to.be.equal(302);
      expect(response.redirect).to.be.equal(true);
      expect(response.headers).to.have.property("location").that.equals("/api/sessions/failure-signup");
    });

    it("Debería retornar un error al intentar crear un usuario sin completar todos los campos", async function () {
      const newUser = {
        email: "prueba@email.com",
        password: "123",
      };

      const response = await requester.post("/api/sessions/signup").send(newUser);

      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.haveOwnProperty("status");
      expect(response._body.message).to.be.equal("Error creando el usuario");
    });
  });

  describe("POST /logout", () => {
    it("Debería cerrar la sesión correctamente y devolver el mensaje de éxito", async function () {
      const response = await requester.post("/api/sessions/logout");
      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.haveOwnProperty("message").that.equals("Sesión finalizada correctamente");
    });

    it("Debería devolver un error al intentar cerrar la sesión sin haber iniciado sesión previamente", async function () {
      const response = await requester.post("/api/sessions/logout");

      expect(response.statusCode).to.be.equal(401);
      expect(response.body).to.haveOwnProperty("message").that.equals("No se ha iniciado sesión");
    });
  });
});

// import chai from "chai";
// import supertest from "supertest";

// const expect = chai.expect;
// const requester = supertest("http://localhost:8080");

// describe("Testing de users", () => {
//   describe("POST /users", () => {

//     it("Debería crear un nuevo usuario correctamente y redirige a /products", async () => {
//       const newUser = {
//         first_name: "nombre",
//         last_name: "apellido",
//         age: "30",
//         email: "prueba@email.com",
//         password: "123",
//       };

//       const response = await requester.post("/api/sessions/signup").send(newUser);

//       expect(response.statusCode).to.be.equal(302);
//       expect(response.redirect).to.be.equal(true);
//       expect(response.headers).to.have.property("location").that.equals("/products");
//     });

//     it("Debería retornar un error al intentar registrar un usuario existente y redirige a /api/sessions/failure-signup", async () => {
//       const newUser = {
//         first_name: "nombre",
//         last_name: "apellido",
//         age: "30",
//         email: "prueba@email.com",
//         password: "123",
//       };

//       const response = await requester.post("/api/sessions/signup").send(newUser);

//       expect(response.statusCode).to.be.equal(302);
//       expect(response.redirect).to.be.equal(true);
//       expect(response.headers).to.have.property("location").that.equals("/api/sessions/failure-signup");
//     });

//     it("Debería retornar un error al intentar crear un usuario sin completar todos los campos", async () => {
//       const newUser = {
//         email: "prueba@email.com",
//         password: "123",
//       };

//       const response = await requester.post("/api/sessions/signup").send(newUser);

//       expect(response.statusCode).to.be.equal(200);
//       expect(response.body).to.haveOwnProperty("status");
//       expect(response._body.message).to.be.equal("Error creando el usuario");
//     });
//   });

//   describe("POST /logout", () => {
//     it("Debería cerrar la sesión correctamente y devolver el mensaje de éxito", async () => {
//       const response = await requester.post("/api/sessions/logout");
//       console.log(response);
//       expect(response.statusCode).to.be.equal(200);
//       expect(response.body).to.haveOwnProperty("message").that.equals("Sesión finalizada correctamente");
//     });

//     it("Debería devolver un error al intentar cerrar la sesión sin haber iniciado sesión previamente", async () => {
//       const response = await requester.post("/api/sessions/logout");

//       expect(response.statusCode).to.be.equal(401);
//       expect(response.body).to.haveOwnProperty("message").that.equals("No se ha iniciado sesión");
//     });
//   });
// });
