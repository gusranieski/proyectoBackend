import nodemailer from "nodemailer";
import { options } from "./config.js";

const adminEmail = options.gmail.adminEmail;
const adminPassword = options.gmail.adminPassword;

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: adminEmail,
    pass: adminPassword,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});
export default transport;
