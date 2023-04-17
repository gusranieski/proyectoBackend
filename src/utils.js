import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (user, loginPassword) => {
  // console.log("stored password: ", user.password);
  // console.log("provided password: ", loginPassword);
  return bcrypt.compareSync(loginPassword, user.password);
};


// export const isValidPassword = (user, loginPassword) => {
//   return bcrypt.compareSync(loginPassword, user.password);
// };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
