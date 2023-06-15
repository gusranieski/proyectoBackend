import jwt from "jsonwebtoken";
import { options } from "../config/config.js";

export const generateTokenPass = (email, expireTime) => {
  const token = jwt.sign({ email }, options.gmail.emailToken, { expiresIn: expireTime });
  return token;
};
