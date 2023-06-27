import __dirname from "../utils.js";
import swaggerJSDoc from "swagger-jsdoc";

const PORT = 8080;

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de backend de app Ecommerce",
      description: "API que documenta la función de los endpoints del proyecto",
      version: "1.0.0",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
