import { Router, json } from "express";

const cartsRouter = Router();
cartsRouter.use(json());


export default cartsRouter;