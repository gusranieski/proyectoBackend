import jwt from "jsonwebtoken";
import { options } from "../config/config.js";

export const generateTokenPass = (email, expireTime) => {
  const token = jwt.sign({ email }, options.gmail.emailToken, { expiresIn: expireTime });
  return token;
};

export const verifyTokenPass = (token) => {
  try {
    const data = jwt.verify(token, options.gmail.emailToken);
    return data.email;
  } catch (error) {
    console.log(error.message);
    return null
  }
};
